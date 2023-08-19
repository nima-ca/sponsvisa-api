import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "src/common/config/interfaces/jwt.interface";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ACCESS_TOKEN_COOKIE_CONFIG,
  ACCESS_TOKEN_KEY_IN_COOKIE,
  REFRESH_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_KEY_IN_COOKIE,
} from "./constants/auth.constants";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import {
  ValidateRefreshTokenDto,
  ValidateRefreshTokenResponseDto,
} from "./dto/refreshToken.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { IGenerateTokens, ITokens } from "./types/auth.types";
import { VerificationService } from "./verification.service";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { LogoutResponseDto } from "./dto/logout.dto";

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

    return { success: true, errors: null };
  }

  async login(
    { email, password }: LoginDto,
    i18n: I18nContext<I18nTranslations>,
    response: Response,
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
    const { hashedRefreshToken, refreshToken, accessToken } =
      this.generateTokens(tokenPayload, refreshTokenPayload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefreshToken },
    });

    this.setTokensInCookie({ accessToken, refreshToken }, response);

    return {
      success: true,
      errors: null,
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
    response: Response,
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
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hashedRefreshToken,
    } = this.generateTokens(tokenPayload, refreshTokenPayload);

    await this.prisma.user.update({
      where: { id: payload.id },
      data: { refresh_token: hashedRefreshToken },
    });

    this.setTokensInCookie(
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      response,
    );

    return {
      success: true,
      errors: null,
    };
  }

  logout(response: Response): LogoutResponseDto {
    response.clearCookie(
      ACCESS_TOKEN_KEY_IN_COOKIE,
      ACCESS_TOKEN_COOKIE_CONFIG,
    );
    response.clearCookie(
      REFRESH_TOKEN_KEY_IN_COOKIE,
      REFRESH_TOKEN_COOKIE_CONFIG,
    );
    return CORE_SUCCESS_DTO;
  }

  generateTokens(
    tokenPayload: IAccessTokenPayload,
    refreshTokenPayload: IRefreshTokenPayload,
  ): IGenerateTokens {
    const accessToken = this.jwtService.signAccessToken(tokenPayload);
    const refreshToken = this.jwtService.signRefreshToken(refreshTokenPayload);
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
    return { accessToken, refreshToken, hashedRefreshToken };
  }

  setTokensInCookie(
    { accessToken, refreshToken }: ITokens,
    response: Response,
  ): void {
    response.cookie(
      ACCESS_TOKEN_KEY_IN_COOKIE,
      accessToken,
      ACCESS_TOKEN_COOKIE_CONFIG,
    );
    response.cookie(
      REFRESH_TOKEN_KEY_IN_COOKIE,
      refreshToken,
      REFRESH_TOKEN_COOKIE_CONFIG,
    );
  }
}
