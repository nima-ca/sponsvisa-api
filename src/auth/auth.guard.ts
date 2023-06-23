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
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { AUTH_USER_KEY_IN_REQUEST } from "./constants/auth.constants";
import { InvalidTokenException } from "./exceptions/invalid-token.exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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
    const user = this.getUser(req);
    if (!user)
      throw new InvalidTokenException(i18n.t(`auth.exceptions.invalidToken`));

    // let all users with any roles access the endpoint
    if (roles.length === 0 || roles.includes(`ANY`)) return true;

    if (!roles.includes(user.role))
      throw new ForbiddenException(i18n.t(`auth.exceptions.notAuthorized`));

    // add user object to
    return true;
  }

  getUser(req: Request): User | null {
    return req[AUTH_USER_KEY_IN_REQUEST] as User | null;
  }
}
