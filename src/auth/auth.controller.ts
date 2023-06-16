import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/generated/i18n.generated";

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  async register(
    @Body() registerDto: RegisterDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto, i18n);
  }

  @Post(`login`)
  async login(
    @Body() loginDto: LoginDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto, i18n);
  }
}
