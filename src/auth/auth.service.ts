import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

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
        throw new BadRequestException(
          `User already exists with the same email`,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return { success: true, error: null };
    } catch (error) {
      if (error instanceof BadRequestException) {
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
