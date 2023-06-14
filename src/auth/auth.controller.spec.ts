import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "src/jwt/jwt.service";
import { ConfigService } from "@nestjs/config";

describe(`AuthController`, () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService, ConfigService],
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
      const result = { success: true, error: null };
      jest.spyOn(service, `register`).mockImplementation(async () => result);
      expect(await controller.register(mockedRegisterDto)).toBe(result);
    });
  });
});
