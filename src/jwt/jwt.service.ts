import { Injectable } from "@nestjs/common";
import * as JWT from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import {
  IAccessTokenPayload,
  IJwt,
} from "src/common/config/interfaces/jwt.interface";

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  signAccessToken(payload: IAccessTokenPayload): string {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);
    const token = JWT.sign(payload, jwtOptions.access.secret, {
      expiresIn: jwtOptions.access.time,
    });
    return token;
  }

  verifyAccessToken<T = unknown>(token: string): T | null {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);

    try {
      return JWT.verify(token, jwtOptions.access.secret) as T;
    } catch (error) {
      return null;
    }
  }

  signRefreshToken(payload: object): string {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);
    return JWT.sign(payload, jwtOptions.refresh.secret, {
      expiresIn: jwtOptions.refresh.time,
    });
  }

  verifyRefreshToken<T = unknown>(token: string): T | null {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);

    try {
      return JWT.verify(token, jwtOptions.refresh.secret) as T;
    } catch (error) {
      return null;
    }
  }
}
