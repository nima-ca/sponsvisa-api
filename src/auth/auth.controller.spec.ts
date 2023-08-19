import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { I18nContext } from "nestjs-i18n";
import * as httpMocks from "node-mocks-http";
import { mockUser } from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { JwtService } from "src/jwt/jwt.service";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerificationService } from "./verification.service";

describe(`AuthController`, () => {
  let service: AuthService;
  let controller: AuthController;

  const i18n = {
    t: jest.fn().mockReturnValue(`random translated text`),
  } as unknown as I18nContext<I18nTranslations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        MailService,
        ConfigService,
        VerificationService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it(`should be defined`, () => {
    expect(controller).toBeDefined();
  });

  describe(`Register`, () => {
    it(`should register a new user`, async () => {
      const mockedRegisterDto: RegisterDto = {
        name: `foo`,
        email: `upchh@example.com`,
        password: `P@ssw0rd`,
        confirmPassword: `P@ssw0rd`,
      };
      const result = { success: true, errors: null };
      jest.spyOn(service, `register`).mockImplementation(async () => result);
      expect(await controller.register(mockedRegisterDto, i18n)).toBe(result);
    });
  });

  describe(`Login`, () => {
    const mockedUser = mockUser();
    it(`should return a token`, async () => {
      const res = httpMocks.createResponse();
      const mockedLoginDto: LoginDto = {
        email: `upchh@example.com`,
        password: `P@ssw0rd`,
      };
      const result: LoginResponseDto = {
        success: true,
        errors: null,
        user: {
          id: mockedUser.id,
          email: mockedUser.email,
          isVerified: mockedUser.isVerified,
          name: mockedUser.name,
          role: mockedUser.role,
        },
      };
      jest.spyOn(service, `login`).mockImplementation(async () => result);
      expect(await controller.login(res, mockedLoginDto, i18n)).toBe(result);
    });
  });
});
