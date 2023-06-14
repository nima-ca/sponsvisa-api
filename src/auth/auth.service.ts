import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { IAccessTokenPayload } from "src/config/interfaces/jwt.interface";

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    email,
    name,
    password,
  }: RegisterDto): Promise<RegisterResponseDto> {
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
  }

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    // check if user exists
    if (!user) {
      throw new IncorrectCredentialsException();
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new IncorrectCredentialsException();
    }

    // create token
    const tokenPayload: IAccessTokenPayload = { id: user.id };
    const token = this.jwtService.signAccessToken(tokenPayload);

    return { success: true, error: null, token };
  }
}
