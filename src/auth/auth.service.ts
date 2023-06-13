import { Injectable } from "@nestjs/common";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  async register({
    email,
    name,
    password,
    confirmPassword,
  }: RegisterDto): Promise<RegisterResponseDto> {
    return;
  }

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    try {
      return { token: `` };
    } catch (error) {}
  }
}
