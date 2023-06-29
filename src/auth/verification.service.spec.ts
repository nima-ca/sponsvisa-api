import { Test, TestingModule } from "@nestjs/testing";
import { VerificationService } from "./verification.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { MailService } from "src/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES } from "./constants/auth.constants";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { User } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";

describe(`VerificationService`, () => {
  let service: VerificationService;
  let prisma: PrismaServiceMock;
  let mailService: MailService;
  let i18n: I18nContext<I18nTranslations>;
  let MOCKED_USER: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
        MailService,
        ConfigService,
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
    mailService = module.get<MailService>(MailService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    i18n = mockI18n();
    MOCKED_USER = mockUser();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(mailService).toBeDefined();
  });

  describe(`sendCode`, () => {
    it(`should throw Error when verification code exists and is not expired`, async () => {
      // Mock the Prisma client
      const verification = {
        id: 1,
        userId: 1,
        expiresIn: new Date(
          Date.now() + VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES * 60 * 1000,
        ),
      };
      prisma.verification.findFirst.mockReturnValue(verification);

      // Execute and assert the thrown exception
      await expect(service.sendCode(MOCKED_USER, i18n)).rejects.toThrowError(
        BadRequestException,
      );

      // Additional assertions
      expect(prisma.verification.findFirst).toHaveBeenCalledWith({
        where: { userId: MOCKED_USER.id },
      });
      expect(prisma.verification.delete).not.toHaveBeenCalled();
    });

    it(`should delete existing verification code and send a new code if it is expired`, async () => {
      // Mock the Prisma client
      const verification = {
        id: 1,
        userId: 1,
        expiresIn: new Date(Date.now() - 60000),
      };
      prisma.verification.findFirst.mockReturnValue(verification);

      // Mock the mail service
      mailService.sendEmail = jest.fn();

      // Execute the sendCode method
      await service.sendCode(MOCKED_USER, i18n);

      // Assertions
      expect(prisma.verification.findFirst).toHaveBeenCalledWith({
        where: { userId: MOCKED_USER.id },
      });
      expect(prisma.verification.delete).toHaveBeenCalledWith({
        where: { id: verification.id },
      });
      expect(mailService.sendEmail).toHaveBeenCalled();
    });

    it(`should send verification code to user`, async () => {
      prisma.verification.findFirst.mockReturnValue(null);
      mailService.sendEmail = jest.fn();
      service.verificationCodeGenerator = jest
        .fn()
        .mockReturnValue(`generated code`);

      // Execute the sendCode method
      await service.sendCode(MOCKED_USER, i18n);

      expect(prisma.verification.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.verification.create).toHaveBeenCalledTimes(1);
      expect(prisma.verification.create).toHaveBeenCalledWith({
        data: {
          code: expect.any(String),
          userId: MOCKED_USER.id,
          expiresIn: expect.any(Date),
        },
      });
      expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.verificationCodeGenerator).toHaveBeenCalledTimes(1);
    });
  });
});
