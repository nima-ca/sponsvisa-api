import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES,
  VERIFICATION_CODE_LENGTH,
} from "./constants/auth.constants";
import { VerifyCodeDto } from "./dto/verification.dto";
import { VerificationService } from "./verification.service";

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

  describe(`verificationCodeGenerator`, () => {
    it(`should generate a verification code of the specified length`, () => {
      const code = service.verificationCodeGenerator();
      expect(code).toHaveLength(VERIFICATION_CODE_LENGTH);
    });
  });

  describe(`isCodeExpired`, () => {
    it(`should return true if the expiration date is in the past`, () => {
      const expirationDate = new Date(Date.now() - 1000); // 1 second ago
      const result = service.isCodeExpired(expirationDate);
      expect(result).toBe(true);
    });

    it(`should return false if the expiration date is in the future`, () => {
      const expirationDate = new Date(Date.now() + 1000); // 1 second from now
      const result = service.isCodeExpired(expirationDate);
      expect(result).toBe(false);
    });

    it(`should return false if the expiration date is the current time`, () => {
      const expirationDate = new Date();
      const result = service.isCodeExpired(expirationDate);
      expect(result).toBe(false);
    });
  });

  describe(`getTimeToWaitForNextVerificationCode`, () => {
    it(`should calculate the correct time to wait in minutes`, () => {
      const expiresIn = new Date(Date.now() + 300000); // 5 minutes from now
      const expectedTimeToWait = 5;
      const result = service.getTimeToWaitForNextVerificationCode(expiresIn);
      expect(result).toBe(expectedTimeToWait);
    });

    it(`should round up the time to wait in minutes`, () => {
      const expiresIn = new Date(Date.now() + 150000); // 2.5 minutes from now
      const expectedTimeToWait = 3;
      const result = service.getTimeToWaitForNextVerificationCode(expiresIn);
      expect(result).toBe(expectedTimeToWait);
    });

    it(`should return 0 if the expiration date is in the past`, () => {
      const expiresIn = new Date(Date.now() - 1000); // 1 second ago
      const expectedTimeToWait = 0;
      const result = service.getTimeToWaitForNextVerificationCode(expiresIn);
      expect(result).toBe(expectedTimeToWait);
    });
  });

  describe(`verifyCode`, () => {
    const dto: VerifyCodeDto = { code: `123456` };

    it(`should throw error if the user is already verified`, () => {
      MOCKED_USER.isVerified = true;
      expect(
        async () => await service.verifyCode(dto, MOCKED_USER, i18n),
      ).rejects.toThrowError(BadRequestException);
      expect.hasAssertions();
    });

    it(`should throw error if verification is not found`, () => {
      MOCKED_USER.isVerified = false;
      prisma.verification.findFirst.mockReturnValue(null);

      expect(
        async () => await service.verifyCode(dto, MOCKED_USER, i18n),
      ).rejects.toThrowError(BadRequestException);
      expect(prisma.verification.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.verification.findFirst).toHaveBeenCalledWith({
        where: { userId: MOCKED_USER.id, code: dto.code },
      });
      expect.hasAssertions();
    });

    it(`should throw error if the verification is expired`, async () => {
      MOCKED_USER.isVerified = false;
      const MOCKED_VERIFICATION = { id: 1, expiresIn: new Date() };
      prisma.verification.findFirst.mockReturnValue(MOCKED_VERIFICATION);
      service.isCodeExpired = jest.fn().mockReturnValue(true);

      await expect(
        service.verifyCode(dto, MOCKED_USER, i18n),
      ).rejects.toThrowError(BadRequestException);

      expect(service.isCodeExpired).toHaveBeenCalledTimes(1);
      expect(service.isCodeExpired).toHaveBeenCalledWith(
        MOCKED_VERIFICATION.expiresIn,
      );
      expect.hasAssertions();
    });

    it(`should verify the user and delete verification`, async () => {
      MOCKED_USER.isVerified = false;
      const MOCKED_VERIFICATION = { id: 1, expiresIn: new Date() };
      prisma.verification.findFirst.mockReturnValue(MOCKED_VERIFICATION);
      service.isCodeExpired = jest.fn().mockReturnValue(false);

      const result = await service.verifyCode(dto, MOCKED_USER, i18n);

      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: MOCKED_USER.id },
        data: { isVerified: true },
      });
      expect(prisma.verification.delete).toHaveBeenCalledTimes(1);
      expect(prisma.verification.delete).toHaveBeenCalledWith({
        where: { id: MOCKED_VERIFICATION.id },
      });
    });
  });

  describe(`sendVerificationCode`, () => {
    it(`should throw error if the user is already verified`, () => {
      MOCKED_USER.isVerified = true;
      expect(
        async () => await service.sendVerificationCode(MOCKED_USER, i18n),
      ).rejects.toThrowError(BadRequestException);
      expect.hasAssertions();
    });

    it(`should send verification code to user`, async () => {
      MOCKED_USER.isVerified = false;
      service.sendCode = jest.fn();

      const result = await service.sendVerificationCode(MOCKED_USER, i18n);
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(service.sendCode).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });
  });
});
