import { Test, TestingModule } from "@nestjs/testing";
import { PrismaServiceMock } from "../utils/generator.utils";
import { LoggerMiddleware } from "./logger.middleware";
import { PrismaService } from "src/prisma/prisma.service";
import * as httpMocks from "node-mocks-http";

describe(`Logger Middleware`, () => {
  let middleware: LoggerMiddleware;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerMiddleware,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    middleware = module.get<LoggerMiddleware>(LoggerMiddleware);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
  });

  it(`should be defined`, () => {
    expect(middleware).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe(`Use`, () => {
    it(`should log every request`, () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const mockNext = jest.fn();
      prisma.log.create.mockReturnValue({
        catch: jest.fn(),
      });
      req.body = {
        test: ``,
      };
      req.baseUrl = `/test`;
      req.url = `/`;

      middleware.use(req, res, mockNext);

      expect(prisma.log.create).toHaveBeenCalledTimes(1);
    });
  });

  describe(`checkPasswordInBody`, () => {
    it(`should return req body and check for password and confirm password and change them`, () => {
      const req = httpMocks.createRequest();
      req.body = {
        test: `test`,
        password: `123456`,
        confirmPassword: `123456`,
      };

      const result = middleware.checkPasswordInBody(req);

      expect(result).toBeDefined();
      expect(result.password).toBeDefined;
      expect(result.password).not.toBe(req.body.password);

      expect(result.confirmPassword).toBeDefined;
      expect(result.confirmPassword).not.toBe(req.body.confirmPassword);

      expect(result.test).toBeDefined;
      expect(result.test).toBe(req.body.test);
    });
  });
});
