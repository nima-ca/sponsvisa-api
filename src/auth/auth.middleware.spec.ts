import { PrismaServiceMock } from "src/common/utils/generator.utils";
import { AuthMiddleware } from "./auth.middleware";
import { JwtService } from "src/jwt/jwt.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import * as httpMocks from "node-mocks-http";
import { IAccessTokenPayload } from "src/common/config/interfaces/jwt.interface";
import { Request, Response } from "express";
import {
  ACCESS_TOKEN_KEY_IN_COOKIE,
  REFRESH_TOKEN_KEY_IN_COOKIE,
} from "./constants/auth.constants";

describe(`AuthMiddleware`, () => {
  let authMiddleware: AuthMiddleware;
  let prisma: PrismaServiceMock;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    authMiddleware = module.get<AuthMiddleware>(AuthMiddleware);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    jwtService = module.get<JwtService>(JwtService);
  });

  it(`should be defined`, () => {
    expect(authMiddleware).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe(`Use`, () => {
    it(`should validate user and add the return value to request`, () => {
      const mockReq = {} as Request;
      const mockRes = {} as Response;
      const mockNext = jest.fn();
      const mockedUser = { id: 1 };
      authMiddleware.validateRequest = jest.fn().mockReturnValue(mockedUser);

      authMiddleware.use(mockReq, mockRes, mockNext);

      expect(authMiddleware.validateRequest).toHaveBeenCalledTimes(1);
      expect(authMiddleware.validateRequest).toHaveBeenCalledWith(mockReq);
    });
  });

  describe(`Get User`, () => {
    it(`should return user if found`, async () => {
      const MOCKED_USER = { id: 1 };
      prisma.user.findFirst.mockReturnValue(MOCKED_USER);

      expect(await authMiddleware.getUser(MOCKED_USER.id)).toBe(MOCKED_USER);
      expect.hasAssertions();
    });

    it(`should return null if user is not found`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      expect(await authMiddleware.getUser(1)).toBe(null);
      expect.hasAssertions();
    });
  });

  describe(`Validate Request`, () => {
    const req = httpMocks.createRequest();
    it(`should extract tokens and return null if it is not found`, async () => {
      req.cookies = {};
      const result = await authMiddleware.validateRequest(req);

      expect(result).toBeNull();
      expect.hasAssertions();
    });

    it(`should verify token and return null if it was not valid`, async () => {
      const MOCKED_ACCESS_TOKEN = `some-random-token`;
      const MOCKED_REFRESH_TOKEN = `some-random-refresh-token`;

      req.cookies = {
        [ACCESS_TOKEN_KEY_IN_COOKIE]: MOCKED_ACCESS_TOKEN,
        [REFRESH_TOKEN_KEY_IN_COOKIE]: MOCKED_REFRESH_TOKEN,
      };

      jwtService.verifyAccessToken = jest.fn().mockReturnValue(null);

      const result = await authMiddleware.validateRequest(req);

      expect(result).toBeNull();
      expect(jwtService.verifyAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtService.verifyAccessToken).toHaveBeenCalledWith(
        MOCKED_ACCESS_TOKEN,
      );
      expect.hasAssertions();
    });

    it(`should find the user and return null if not found`, async () => {
      const MOCKED_ACCESS_TOKEN = `some-random-token`;
      const MOCKED_REFRESH_TOKEN = `some-random-refresh-token`;

      req.cookies = {
        [ACCESS_TOKEN_KEY_IN_COOKIE]: MOCKED_ACCESS_TOKEN,
        [REFRESH_TOKEN_KEY_IN_COOKIE]: MOCKED_REFRESH_TOKEN,
      };

      const TOKEN_PAYLOAD: IAccessTokenPayload = { id: 1 };
      jwtService.verifyAccessToken = jest.fn().mockReturnValue(TOKEN_PAYLOAD);
      authMiddleware.getUser = jest.fn().mockResolvedValue(null);

      const result = await authMiddleware.validateRequest(req);

      expect(result).toBeNull();
      expect(authMiddleware.getUser).toHaveBeenCalledTimes(1);
      expect(authMiddleware.getUser).toHaveBeenCalledWith(TOKEN_PAYLOAD.id);
      expect.hasAssertions();
    });

    it(`should return the user if user is found`, async () => {
      const MOCKED_ACCESS_TOKEN = `some-random-token`;
      const MOCKED_REFRESH_TOKEN = `some-random-refresh-token`;

      req.cookies = {
        [ACCESS_TOKEN_KEY_IN_COOKIE]: MOCKED_ACCESS_TOKEN,
        [REFRESH_TOKEN_KEY_IN_COOKIE]: MOCKED_REFRESH_TOKEN,
      };

      const MOCKED_USER = { id: 1 };
      const TOKEN_PAYLOAD: IAccessTokenPayload = { id: 1 };

      jwtService.verifyAccessToken = jest.fn().mockReturnValue(TOKEN_PAYLOAD);
      authMiddleware.getUser = jest.fn().mockResolvedValue(MOCKED_USER);

      expect(await authMiddleware.validateRequest(req)).toEqual(MOCKED_USER);
      expect.hasAssertions();
    });
  });
});
