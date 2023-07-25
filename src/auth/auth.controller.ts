import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Response } from "express";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { setRole } from "src/common/decorators/setRole.decorator";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import {
  ValidateRefreshTokenDto,
  ValidateRefreshTokenResponseDto,
} from "./dto/refreshToken.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import {
  SendVerificationCodeResponseDto,
  VerifyCodeDto,
  VerifyCodeResponseDto,
} from "./dto/verification.dto";
import { VerificationService } from "./verification.service";
import { LogoutResponseDto } from "./dto/logout.dto";

@ApiTags(`auth`)
@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post(`register`)
  register(
    @Body() registerDto: RegisterDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, i18n);
  }

  @Post(`login`)
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, i18n, response);
  }

  @Post(`logout`)
  logout(@Res({ passthrough: true }) response: Response): LogoutResponseDto {
    return this.authService.logout(response);
  }

  @Post(`refresh_token`)
  validateRefreshToken(
    @Res({ passthrough: true }) response: Response,
    @Body() validateRefreshTokenDto: ValidateRefreshTokenDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<ValidateRefreshTokenResponseDto> {
    return this.authService.validateRefreshToken(
      validateRefreshTokenDto,
      i18n,
      response,
    );
  }

  @Post(`verify_code`)
  @setRole([`ANY`])
  verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @AuthUser() user: User,
  ): Promise<VerifyCodeResponseDto> {
    return this.verificationService.verifyCode(verifyCodeDto, user, i18n);
  }

  @Post(`send_verification_code`)
  @setRole([`ANY`])
  sendVerificationCode(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @AuthUser() user: User,
  ): Promise<SendVerificationCodeResponseDto> {
    return this.verificationService.sendVerificationCode(user, i18n);
  }
}
