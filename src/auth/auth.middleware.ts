import { Injectable, NestMiddleware } from "@nestjs/common";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { IAccessTokenPayload } from "src/common/config/interfaces/jwt.interface";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ACCESS_TOKEN_KEY_IN_COOKIE,
  AUTH_USER_KEY_IN_REQUEST,
  REFRESH_TOKEN_KEY_IN_COOKIE,
} from "./constants/auth.constants";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.validateRequest(req);
    req[AUTH_USER_KEY_IN_REQUEST] = user;
    next();
  }

  async validateRequest(req: Request): Promise<User | null> {
    // extract token from header
    const accessToken = req.cookies?.[ACCESS_TOKEN_KEY_IN_COOKIE];
    const refreshToken = req.cookies?.[REFRESH_TOKEN_KEY_IN_COOKIE];
    if (!accessToken || !refreshToken) return null;

    // verify token and extract payload
    const payload =
      this.jwtService.verifyAccessToken<IAccessTokenPayload | null>(
        accessToken,
      );
    if (!payload) return null;

    const user = await this.getUser(payload.id);
    if (!user) return null;

    return user;
  }

  async getUser(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }
}
