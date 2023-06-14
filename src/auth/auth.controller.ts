import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";

@Controller({
  path: `auth`,
  version: `1`,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`register`)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post(`login`)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }
}
