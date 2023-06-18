import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { I18nContext } from "nestjs-i18n";
import { IAccessTokenPayload } from "src/common/config/interfaces/jwt.interface";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    { email, name, password }: RegisterDto,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<RegisterResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new UserAlreadyExistsException(
        i18n.t(`auth.exceptions.userAlreadyExists`),
      );
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, error: null };
  }

  async login(
    { email, password }: LoginDto,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    const INCORRECT_CREDENTIALS_EXCEPTION = i18n.t(
      `auth.exceptions.incorrectCredentials`,
    );

    // check if user exists
    if (!user) {
      throw new IncorrectCredentialsException(INCORRECT_CREDENTIALS_EXCEPTION);
    }

    // check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      throw new IncorrectCredentialsException(INCORRECT_CREDENTIALS_EXCEPTION);
    }

    // create token
    const tokenPayload: IAccessTokenPayload = { id: user.id };
    const token = this.jwtService.signAccessToken(tokenPayload);

    return { success: true, error: null, token };
  }
}
