import {
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import * as httpMocks from "node-mocks-http";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "src/common/config/interfaces/jwt.interface";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import {
  PrismaServiceMock,
  VerificationServiceMock,
  mockUser,
} from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService, PASSWORD_HASH_SALT } from "./auth.service";
import {
  ACCESS_TOKEN_COOKIE_CONFIG,
  ACCESS_TOKEN_KEY_IN_COOKIE,
  REFRESH_TOKEN_COOKIE_CONFIG,
  REFRESH_TOKEN_KEY_IN_COOKIE,
} from "./constants/auth.constants";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { ValidateRefreshTokenDto } from "./dto/refreshToken.dto";
import { RegisterDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { IGenerateTokens, ITokens } from "./types/auth.types";
import { VerificationService } from "./verification.service";

jest.mock(`bcrypt`);
describe(`AuthService`, () => {
  let service: AuthService;
  let prisma: PrismaServiceMock;
  let jwtService: JwtService;
  let verificationService: VerificationServiceMock;

  const i18n = {
    t: jest.fn().mockReturnValue(`random translated text`),
  } as unknown as I18nContext<I18nTranslations>;
  let mockedUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
        {
          provide: VerificationService,
          useClass: VerificationServiceMock,
        },
        JwtService,
        MailService,
        ConfigService,
      ],
    }).compile();

    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    verificationService = module.get<VerificationService>(
      VerificationService,
    ) as unknown as VerificationServiceMock;
    mockedUser = mockUser();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(verificationService).toBeDefined();
  });

  describe(`Register`, () => {
    const mockedData: RegisterDto = {
      name: `test`,
      email: `test@test.com`,
      password: `Test@1234`,
      confirmPassword: `Test@1234`,
    };

    it(`should search for the user`, async () => {
      prisma.user.findFirst.mockReturnValue({ id: 1 });

      try {
        await service.register(mockedData, i18n);
      } catch (error) {}

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockedData.email },
      });
      expect.hasAssertions();
    });

    it(`should fail if there email already exists`, async () => {
      prisma.user.findFirst.mockReturnValue({ id: 1 });

      expect(
        async () => await service.register(mockedData, i18n),
      ).rejects.toThrowError(UserAlreadyExistsException);

      expect.hasAssertions();
    });

    it(`should hash the password`, async () => {
      prisma.user.findFirst.mockReturnValue(null);
      jest.mocked(bcrypt.hashSync).mockReturnValue(`hashed-password`);
      await service.register(mockedData, i18n);

      expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(
        mockedData.password,
        PASSWORD_HASH_SALT,
      );
      expect.hasAssertions();
    });

    it(`should create a user`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      const result = await service.register(mockedData, i18n);
      jest.mocked(bcrypt.hashSync).mockReturnValue(`hashed-password`);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: mockedData.email,
          password: expect.any(String),
          name: mockedData.name,
        },
      });
      expect(result).toEqual({ success: true, error: null });
    });

    it(`should send verification code`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      await service.register(mockedData, i18n);

      expect(verificationService.sendCode).toHaveBeenCalledTimes(1);
    });

    it(`should fail on error`, async () => {
      prisma.user.findFirst.mockImplementation(() => {
        throw new InternalServerErrorException();
      });

      expect(
        async () => await service.register(mockedData, i18n),
      ).rejects.toThrowError();

      expect.hasAssertions();
    });
  });

  describe(`Login`, () => {
    const userInput: LoginDto = {
      email: `test@example.com`,
      password: `P@assw0rd`,
    };

    let res: Response;
    beforeEach(() => {
      res = httpMocks.createResponse();
    });

    it(`should find the user`, async () => {
      prisma.user.findFirst.mockReturnValue({ id: 1 });

      expect(
        async () => await service.login(userInput, i18n, res),
      ).rejects.toThrow();

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: userInput.email },
      });
      expect.hasAssertions();
    });

    it(`should throw error if the user is not found`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      expect(
        async () => await service.login(userInput, i18n, res),
      ).rejects.toThrowError(IncorrectCredentialsException);

      expect.hasAssertions();
    });

    it(`should throw error if the password is wrong`, async () => {
      prisma.user.findFirst.mockReturnValue(mockedUser);
      jest.mocked(bcrypt.compareSync).mockReturnValue(false);

      try {
        await service.login(userInput, i18n, res);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(IncorrectCredentialsException);
      }

      expect(bcrypt.compareSync).toHaveBeenCalled();
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        userInput.password,
        mockedUser.password,
      );
      expect.hasAssertions();
    });

    it(`should create and set access and refresh tokens`, async () => {
      const MOCKED_GENERATED_TOKENS: IGenerateTokens = {
        accessToken: `some random token`,
        hashedRefreshToken: `hashed refresh token`,
        refreshToken: `some random refresh token`,
      };

      const EXPECTED_LOGIN_RESULT_DTO: LoginResponseDto = {
        success: true,
        error: null,
        user: {
          id: mockedUser.id,
          email: mockedUser.email,
          isVerified: mockedUser.isVerified,
          name: mockedUser.name,
          role: mockedUser.role,
        },
      };

      prisma.user.findFirst.mockReturnValue(mockedUser);
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);
      service.generateTokens = jest
        .fn()
        .mockReturnValue(MOCKED_GENERATED_TOKENS);

      service.setTokensInCookie = jest.fn();

      const result = await service.login(userInput, i18n, res);

      expect(service.generateTokens).toHaveBeenCalledTimes(1);
      expect(service.setTokensInCookie).toHaveBeenCalledTimes(1);
      expect(service.setTokensInCookie).toHaveBeenCalledWith(
        {
          accessToken: MOCKED_GENERATED_TOKENS.accessToken,
          refreshToken: MOCKED_GENERATED_TOKENS.refreshToken,
        },
        res,
      );

      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: { refresh_token: MOCKED_GENERATED_TOKENS.hashedRefreshToken },
      });
      expect(result).toEqual(EXPECTED_LOGIN_RESULT_DTO);
      expect.hasAssertions();
    });
  });

  describe(`Logout`, () => {
    const res = httpMocks.createResponse();

    it(`should clear access and refresh tokens and return success message`, () => {
      const clearCookieMock = jest.fn();
      res.clearCookie = clearCookieMock;

      const result = service.logout(res);

      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(clearCookieMock).toHaveBeenCalledTimes(2);
      expect(clearCookieMock).toHaveBeenNthCalledWith(
        1,
        ACCESS_TOKEN_KEY_IN_COOKIE,
        ACCESS_TOKEN_COOKIE_CONFIG,
      );

      expect(clearCookieMock).toHaveBeenNthCalledWith(
        2,
        REFRESH_TOKEN_KEY_IN_COOKIE,
        REFRESH_TOKEN_COOKIE_CONFIG,
      );

      expect.hasAssertions();
    });
  });

  describe(`Refresh Token`, () => {
    const MOCKED_REFRESH_TOKEN = `your-refresh-token`;
    const dto: ValidateRefreshTokenDto = {
      refreshToken: MOCKED_REFRESH_TOKEN,
    };

    let res: Response;
    beforeEach(() => {
      res = httpMocks.createResponse();
    });

    it(`should validate the refresh token and set new tokens`, async () => {
      const payload = { id: mockedUser.id };

      // Mocking the dependencies
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(payload);
      prisma.user.findFirst.mockResolvedValueOnce({
        ...mockedUser,
        refresh_token: `hashed-refresh-token`,
      });

      // mock bcrypt
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);

      // mock generateToken method
      const newTokens: IGenerateTokens = {
        accessToken: `new-token`,
        refreshToken: `new-refresh-token`,
        hashedRefreshToken: `new-hashed-refresh-token`,
      };
      service.generateTokens = jest.fn().mockReturnValueOnce(newTokens);
      service.setTokensInCookie = jest.fn();

      // call the service
      const result = await service.validateRefreshToken(dto, i18n, res);

      expect(jwtService.verifyRefreshToken).toHaveBeenCalledWith(
        MOCKED_REFRESH_TOKEN,
      );
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: payload.id },
      });

      expect(service.generateTokens).toHaveBeenCalledWith(
        { id: payload.id },
        { id: payload.id },
      );
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: payload.id },
        data: { refresh_token: newTokens.hashedRefreshToken },
      });

      expect(service.setTokensInCookie).toHaveBeenCalledTimes(1);
      expect(service.setTokensInCookie).toHaveBeenCalledWith(
        {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        },
        res,
      );

      expect(result).toEqual(CORE_SUCCESS_DTO);
    });

    it(`should fail if the token is invalid`, () => {
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(null);

      expect(async () =>
        service.validateRefreshToken(dto, i18n, res),
      ).rejects.toThrowError(UnauthorizedException);

      expect(jwtService.verifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.verifyRefreshToken).toHaveBeenCalledWith(
        MOCKED_REFRESH_TOKEN,
      );
      expect.hasAssertions();
    });

    it(`should fail if the user is not found`, () => {
      const payload = { id: 1 };
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(payload);
      prisma.user.findFirst = jest.fn().mockReturnValue(null);

      expect(async () =>
        service.validateRefreshToken(dto, i18n, res),
      ).rejects.toThrowError(UnauthorizedException);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: payload.id },
      });
      expect.hasAssertions();
    });

    it(`should fail if the refresh token is not the same in the db for user`, () => {
      const payload = { id: 1 };
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(payload);
      const MOCKED_USER_FOUND = {
        id: payload.id,
        refresh_token: `hashed-refresh-token`,
      };
      prisma.user.findFirst = jest.fn().mockReturnValue(MOCKED_USER_FOUND);
      jest.mocked(bcrypt.compareSync).mockReturnValue(false);

      expect(async () =>
        service.validateRefreshToken(dto, i18n, res),
      ).rejects.toThrowError(UnauthorizedException);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        MOCKED_REFRESH_TOKEN,
        MOCKED_USER_FOUND.refresh_token,
      );
      expect.hasAssertions();
    });
  });

  describe(`generateTokens`, () => {
    const mockedUser = { id: 1, password: `random-hashed-password` };

    it(`should generate token and refresh token and hash the refresh token and return all of them`, () => {
      const MOCKED_JWT_SIGN_ACCESS_TOKEN_RES = `jwt-sign-access-token`;
      jwtService.signAccessToken = jest
        .fn()
        .mockReturnValue(MOCKED_JWT_SIGN_ACCESS_TOKEN_RES);

      const MOCKED_JWT_SIGN_REFRESH_TOKEN_RES = `jwt-sign-refresh-token`;
      jwtService.signRefreshToken = jest
        .fn()
        .mockReturnValue(MOCKED_JWT_SIGN_REFRESH_TOKEN_RES);

      const MOCKED_BCRYPT_HASH_RES = `hashed-refresh-token`;
      jest.mocked(bcrypt.hashSync).mockReturnValue(MOCKED_BCRYPT_HASH_RES);

      const MOCKED_TOKEN_PAYLOAD: IAccessTokenPayload = { id: mockedUser.id };
      const MOCKED_REFRESH_TOKEN_PAYLOAD: IRefreshTokenPayload = {
        id: mockedUser.id,
      };

      const EXPECTED_RESULT: IGenerateTokens = {
        accessToken: MOCKED_JWT_SIGN_ACCESS_TOKEN_RES,
        refreshToken: MOCKED_JWT_SIGN_REFRESH_TOKEN_RES,
        hashedRefreshToken: MOCKED_BCRYPT_HASH_RES,
      };

      const result = service.generateTokens(
        MOCKED_TOKEN_PAYLOAD,
        MOCKED_REFRESH_TOKEN_PAYLOAD,
      );

      expect(result).toEqual(EXPECTED_RESULT);
      expect.hasAssertions();
    });
  });

  describe(`setTokensInCookie`, () => {
    let res: Response;
    beforeEach(() => {
      res = httpMocks.createResponse();
    });

    it(`should set access and refresh tokens in the response cookie`, () => {
      const tokens: ITokens = {
        accessToken: `some random token`,
        refreshToken: `some random refresh token`,
      };
      const cookieFnMock = jest.fn();
      res.cookie = cookieFnMock;

      service.setTokensInCookie(tokens, res);

      expect(cookieFnMock).toHaveBeenCalledTimes(2);
      expect(cookieFnMock).toHaveBeenNthCalledWith(
        1,
        ACCESS_TOKEN_KEY_IN_COOKIE,
        tokens.accessToken,
        ACCESS_TOKEN_COOKIE_CONFIG,
      );

      expect(cookieFnMock).toHaveBeenNthCalledWith(
        2,
        REFRESH_TOKEN_KEY_IN_COOKIE,
        tokens.refreshToken,
        REFRESH_TOKEN_COOKIE_CONFIG,
      );

      expect.hasAssertions();
    });
  });
});
