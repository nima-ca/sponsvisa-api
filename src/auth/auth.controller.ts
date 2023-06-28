import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { ValidateRefreshTokenDto } from "./dto/refreshToken.dto";

@ApiTags(`auth`)
@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  register(
    @Body() registerDto: RegisterDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, i18n);
  }

  @Post(`login`)
  login(
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, i18n);
  }

  @Post(`refresh_token`)
  validateRefreshToken(
    @Body() validateRefreshTokenDto: ValidateRefreshTokenDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<LoginResponseDto> {
    return this.authService.validateRefreshToken(validateRefreshTokenDto, i18n);
  }
}
