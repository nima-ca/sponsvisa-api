import { Injectable } from "@nestjs/common";
import * as JWT from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { IJwt } from "src/config/interfaces/jwt.interface";

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  signAccessToken(payload: object): string {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);
    return JWT.sign(payload, jwtOptions.access.secret);
  }

  verifyAccessToken<T = unknown>(token: string): T {
    const jwtOptions = this.configService.get<IJwt>(`jwt`);
    return JWT.verify(token, jwtOptions.access.secret) as T;
  }
}
