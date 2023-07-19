import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { I18nContext } from "nestjs-i18n";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "src/common/config/interfaces/jwt.interface";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import {
  ValidateRefreshTokenDto,
  ValidateRefreshTokenResponseDto,
} from "./dto/refreshToken.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { IGenerateTokens } from "./types/auth.types";
import { VerificationService } from "./verification.service";

export const PASSWORD_HASH_SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationService,
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

    const createdUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    this.verificationService.sendCode(createdUser, i18n);

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

    // create token and refresh token and hash refresh token to save in db
    const tokenPayload: IAccessTokenPayload = { id: user.id };
    const refreshTokenPayload: IRefreshTokenPayload = { id: user.id };
    const { hashedRefreshToken, refreshToken, token } = this.generateTokens(
      tokenPayload,
      refreshTokenPayload,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefreshToken },
    });

    return {
      success: true,
      error: null,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  async validateRefreshToken(
    { refreshToken }: ValidateRefreshTokenDto,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<ValidateRefreshTokenResponseDto> {
    const payload =
      this.jwtService.verifyRefreshToken<IAccessTokenPayload>(refreshToken);

    const INVALID_REFRESH_TOKEN = i18n.t(`auth.exceptions.invalidRefreshToken`);
    if (!payload || !payload.id) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const isRefreshTokenValid = bcrypt.compareSync(
      refreshToken,
      user.refresh_token,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const tokenPayload: IAccessTokenPayload = { id: user.id };
    const refreshTokenPayload: IRefreshTokenPayload = { id: user.id };
    const {
      token: newToken,
      refreshToken: newRefreshToken,
      hashedRefreshToken,
    } = this.generateTokens(tokenPayload, refreshTokenPayload);

    await this.prisma.user.update({
      where: { id: payload.id },
      data: { refresh_token: hashedRefreshToken },
    });

    return {
      success: true,
      error: null,
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
      },
    };
  }

  generateTokens(
    tokenPayload: IAccessTokenPayload,
    refreshTokenPayload: IRefreshTokenPayload,
  ): IGenerateTokens {
    const token = this.jwtService.signAccessToken(tokenPayload);
    const refreshToken = this.jwtService.signRefreshToken(refreshTokenPayload);
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
    return { token, refreshToken, hashedRefreshToken };
  }
}
