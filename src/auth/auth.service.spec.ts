import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService, PASSWORD_HASH_SALT } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { IncorrectCredentialsException } from "./exceptions/incorrect-credentials.exception";
import { UserAlreadyExistsException } from "./exceptions/user-already-exists.exception";
import { PrismaServiceMock } from "src/common/utils/generator.utils";

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
      const MOCKED_TOKEN = `some random token`;
      prisma.user.findFirst.mockReturnValue(mockedUser);
      jest.mocked(bcrypt.compareSync).mockReturnValue(true);
      jwtService.signAccessToken = jest.fn().mockReturnValue(MOCKED_TOKEN);

      const result = await service.login(userInput, i18n);

      expect(jwtService.signAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtService.signAccessToken).toHaveBeenCalledWith({
        id: mockedUser.id,
      });
      expect(result).toEqual({
        success: true,
        error: null,
        token: MOCKED_TOKEN,
      });
      expect.hasAssertions();
    });
  });
});
