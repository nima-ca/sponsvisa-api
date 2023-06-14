import { InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService, PASSWORD_HASH_SALT } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";

jest.mock(`bcrypt`, () => {
  return {
    hash: jest.fn().mockReturnValue(`some-random-string`),
  };
});

describe(`AuthService`, () => {
  let service: AuthService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<AuthService>(AuthService);
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
      prisma.user.findFirst = jest.fn().mockReturnValue({ id: 1 });

      await service.register(mockedData);

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: mockedData.email },
      });
      expect.hasAssertions();
    });

    it(`should fail if there email already exists`, async () => {
      prisma.user.findFirst = jest.fn().mockReturnValue({ id: 1 });

      const result = await service.register(mockedData);

      expect(result).toEqual(expect.objectContaining({ success: false }));
      expect.hasAssertions();
    });

    it(`should hash the password`, async () => {
      prisma.user.findFirst = jest.fn().mockReturnValue(null);

      await service.register(mockedData);

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockedData.password,
        PASSWORD_HASH_SALT,
      );
      expect.hasAssertions();
    });

    it(`should create a user`, async () => {
      prisma.user.findFirst = jest.fn().mockReturnValue(null);
      prisma.user.create = jest.fn().mockReturnValue(null);

      const result = await service.register(mockedData);

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
      prisma.user.findFirst = jest.fn().mockRejectedValue(new Error());

      try {
        await service.register(mockedData);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }

      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });
  });
});
