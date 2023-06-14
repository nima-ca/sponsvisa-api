import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register({
    email,
    name,
    password,
  }: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });

      if (user) {
        throw new UserAlreadyExistsException();
      }

      const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT);

      await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { success: true, error: null };
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return { success: false, error: error.message };
      }

      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    try {
      return { token: `` };
    } catch (error) {}
  }
}
