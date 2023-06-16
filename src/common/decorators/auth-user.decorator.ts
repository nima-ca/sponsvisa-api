import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { AUTH_USER_KEY_IN_REQUEST } from "src/auth/constants/auth.constants";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[AUTH_USER_KEY_IN_REQUEST];
  },
);
