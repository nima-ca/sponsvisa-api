import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";

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

  // describe(`Register`, () => {});
});
