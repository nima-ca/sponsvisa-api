import {
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { I18nContext } from "nestjs-i18n";
import { PrismaServiceMock } from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService, PASSWORD_HASH_SALT } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { IGenerateTokens } from "./types/auth.types";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "src/common/config/interfaces/jwt.interface";
import {
  ValidateRefreshTokenDto,
  ValidateRefreshTokenResponseDto,
} from "./dto/refreshToken.dto";

jest.mock(`bcrypt`);
describe(`AuthService`, () => {
  let service: AuthService;
  let prisma: PrismaServiceMock;
  let jwtService: JwtService;

  const i18n = {
    t: jest.fn().mockReturnValue(`random translated text`),
  } as unknown as I18nContext<I18nTranslations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
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

    const mockedUser = { id: 1, password: `random-hashed-password` };

    it(`should find the user`, async () => {
      prisma.user.findFirst.mockReturnValue({ id: 1 });

      try {
        await service.login(userInput, i18n);
      } catch (error) {}

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: userInput.email },
      });
      expect.hasAssertions();
    });

    it(`should throw error if the user is not found`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      expect(
        async () => await service.login(userInput, i18n),
      ).rejects.toThrowError(IncorrectCredentialsException);

      expect.hasAssertions();
    });

    it(`should throw error if the password is wrong`, async () => {
      prisma.user.findFirst.mockReturnValue(mockedUser);
      jest.mocked(bcrypt.compareSync).mockReturnValue(false);

      try {
        await service.login(userInput, i18n);
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

    it(`should create and return token`, async () => {
      const MOCKED_GENERATED_TOKENS: IGenerateTokens = {
        token: `some random token`,
        hashedRefreshToken: `hashed refresh token`,
        refreshToken: `some random refresh token`,
      };

      const EXPECTED_LOGIN_RESULT_DTO: LoginResponseDto = {
        success: true,
        error: null,
        token: MOCKED_GENERATED_TOKENS.token,
        refreshToken: MOCKED_GENERATED_TOKENS.refreshToken,
      };

      prisma.user.findFirst.mockReturnValue(mockedUser);
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);
      service.generateTokens = jest
        .fn()
        .mockReturnValue(MOCKED_GENERATED_TOKENS);

      const result = await service.login(userInput, i18n);

      expect(service.generateTokens).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: { refresh_token: MOCKED_GENERATED_TOKENS.hashedRefreshToken },
      });
      expect(result).toEqual(EXPECTED_LOGIN_RESULT_DTO);
      expect.hasAssertions();
    });
  });

  describe(`Refresh Token`, () => {
    const MOCKED_REFRESH_TOKEN = `your-refresh-token`;
    const dto: ValidateRefreshTokenDto = {
      refreshToken: MOCKED_REFRESH_TOKEN,
    };

    it(`should validate the refresh token and return new tokens`, async () => {
      const payload = { id: 123 };

      // Mocking the dependencies
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(payload);
      prisma.user.findFirst.mockResolvedValueOnce({
        id: payload.id,
        refresh_token: `hashed-refresh-token`,
      });

      // mock bcrypt
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);

      // mock generateToken method
      const newTokens: IGenerateTokens = {
        token: `new-token`,
        refreshToken: `new-refresh-token`,
        hashedRefreshToken: `new-hashed-refresh-token`,
      };
      service.generateTokens = jest.fn().mockReturnValueOnce(newTokens);

      // call the service
      const result = await service.validateRefreshToken(dto, i18n);

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

      const EXPECTED_RESULT: ValidateRefreshTokenResponseDto = {
        success: true,
        error: null,
        token: newTokens.token,
        refreshToken: newTokens.refreshToken,
      };
      expect(result).toEqual(EXPECTED_RESULT);
    });

    it(`should fail if the token is invalid`, () => {
      jwtService.verifyRefreshToken = jest.fn().mockReturnValue(null);

      expect(async () =>
        service.validateRefreshToken(dto, i18n),
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
        service.validateRefreshToken(dto, i18n),
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
        service.validateRefreshToken(dto, i18n),
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
        token: MOCKED_JWT_SIGN_ACCESS_TOKEN_RES,
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
});
