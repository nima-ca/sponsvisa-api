import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
import { Request } from "express";
import { I18nContext } from "nestjs-i18n";
import {
  ROLE_METADATA_KEY,
  Roles,
} from "src/common/decorators/setRole.decorator";
import { IAccessTokenPayload } from "src/common/config/interfaces/jwt.interface";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AUTH_USER_KEY_IN_REQUEST } from "./constants/auth.constants";
import { InvalidTokenException } from "./exceptions/invalid-token.exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const i18n = I18nContext.current<I18nTranslations>();

    const roles = this.reflector.get<Roles[]>(
      ROLE_METADATA_KEY,
      context.getHandler(),
    );

    // if no metadata is provided the endpoint will be public
    if (!roles) return true;

    // validate request and get user
    const user = await this.validateRequest(req, i18n);

    // let all users with any roles access the endpoint
    if (roles.length === 0 || roles.includes(`ANY`)) {
      this.addUserToRequest(user, req);
      return true;
    }

    if (!roles.includes(user.role))
      throw new ForbiddenException(i18n.t(`auth.exceptions.notAuthorized`));

    // add user object to
    this.addUserToRequest(user, req);
    return true;
  }

  addUserToRequest(user: User, req: Request) {
    req[AUTH_USER_KEY_IN_REQUEST] = user;
  }

  async validateRequest(
    req: Request,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<User | null> {
    const invalidTokenExceptionMessage = i18n.t(`auth.exceptions.invalidToken`);

    // extract token from header
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new InvalidTokenException(invalidTokenExceptionMessage);

    // verify token and extract payload
    const payload =
      this.jwtService.verifyAccessToken<IAccessTokenPayload | null>(token);
    if (!payload) throw new InvalidTokenException(invalidTokenExceptionMessage);

    const user = await this.getUser(payload.id);
    if (!user) throw new InvalidTokenException(invalidTokenExceptionMessage);

    return user;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(` `) ?? [];
    return type === `Bearer` ? token : undefined;
  }

  async getUser(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }
}
