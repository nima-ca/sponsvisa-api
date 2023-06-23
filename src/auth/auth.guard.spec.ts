import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { I18nContext } from "nestjs-i18n/dist/i18n.context";
import * as httpMocks from "node-mocks-http";
import { IAccessTokenPayload } from "src/common/config/interfaces/jwt.interface";
import {
  ROLE_METADATA_KEY,
  Roles,
} from "src/common/decorators/setRole.decorator";
import { PrismaServiceMock, mockI18n } from "src/common/utils/generator.utils";
import { JwtService } from "src/jwt/jwt.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthGuard } from "./auth.guard";
import { InvalidTokenException } from "./exceptions/invalid-token.exception";

jest.mock(`nestjs-i18n/dist/i18n.context`);

const mockReflector = () => ({
  // eslint-disable-next-line @typescript-eslint/ban-types
  get: jest.fn((metadataKey: string, target: Function): Roles[] => []),
});

const i18n = mockI18n();

describe(`AuthGuard`, () => {
  let guard: AuthGuard;
  let reflector: Reflector;
  let prisma: PrismaServiceMock;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useValue: mockReflector(),
        },
        AuthGuard,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    jwtService = module.get<JwtService>(JwtService);
  });

  it(`should be defined`, () => {
    expect(guard).toBeDefined();
  });

  describe(`Can Activate`, () => {
    jest.mocked(I18nContext.current).mockImplementation(() => i18n);
    const MOCKED_USER = { id: 1, role: UserRole.ADMIN };

    it(`should return true if there were no metadata provided`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue(undefined);

      expect(await guard.canActivate(context)).toBe(true);
      expect(reflector.get).toHaveBeenCalledTimes(1);
      expect(reflector.get).toHaveBeenCalledWith(
        ROLE_METADATA_KEY,
        context.getHandler(),
      );
      expect.hasAssertions();
    });

    it(`should validate request if role metadata is provided`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([]);
      guard.validateRequest = jest.fn().mockReturnValue(MOCKED_USER);
      await guard.canActivate(context);

      expect(guard.validateRequest).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should return true if metadata role is empty and add user to request`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([]);
      guard.validateRequest = jest.fn().mockReturnValue(MOCKED_USER);
      guard.addUserToRequest = jest.fn();

      expect(await guard.canActivate(context)).toBe(true);
      expect(guard.addUserToRequest).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should return true if metadata role is "ANY" and add user to request`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([`ANY`]);
      guard.validateRequest = jest.fn().mockReturnValue(MOCKED_USER);
      guard.addUserToRequest = jest.fn();

      expect(await guard.canActivate(context)).toBe(true);
      expect(guard.addUserToRequest).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should throw ForbiddenException if the user role in not in metadata role`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([UserRole.USER]);
      guard.validateRequest = jest.fn().mockReturnValue(MOCKED_USER);
      guard.addUserToRequest = jest.fn();

      expect(async () => await guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
      expect.hasAssertions();
    });

    it(`should return true if the user role matches metadata role and add user to request`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([MOCKED_USER.role]);
      guard.validateRequest = jest.fn().mockReturnValue(MOCKED_USER);
      guard.addUserToRequest = jest.fn();

      expect(await guard.canActivate(context)).toBe(true);
      expect(guard.addUserToRequest).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });
  });

  describe(`Get User`, () => {
    it(`should return user if found`, async () => {
      const MOCKED_USER = { id: 1 };
      prisma.user.findFirst.mockReturnValue(MOCKED_USER);

      expect(await guard.getUser(MOCKED_USER.id)).toBe(MOCKED_USER);
      expect.hasAssertions();
    });

    it(`should return null if user is not found`, async () => {
      prisma.user.findFirst.mockReturnValue(null);

      expect(await guard.getUser(1)).toBe(null);
      expect.hasAssertions();
    });
  });

  describe(`Extract Token From Header`, () => {
    it(`should return token if starts with Bearer`, () => {
      const MOCKED_TOKEN = `some-random-token`;
      const req = httpMocks.createRequest();
      req.headers.authorization = `Bearer ${MOCKED_TOKEN}`;

      expect(guard.extractTokenFromHeader(req)).toBe(MOCKED_TOKEN);
      expect.hasAssertions();
    });

    it(`should return undefined if Bearer token is not found in the header`, () => {
      const req = httpMocks.createRequest();
      req.headers.authorization = ``;

      expect(guard.extractTokenFromHeader(req)).toBe(undefined);
      expect.hasAssertions();
    });
  });

  describe(`Validate Request`, () => {
    const req = httpMocks.createRequest();
    it(`should extract token and throw error if it is not found`, () => {
      guard.extractTokenFromHeader = jest.fn().mockReturnValue(undefined);

      expect(async () => guard.validateRequest(req, i18n)).rejects.toThrow(
        InvalidTokenException,
      );
      expect(guard.extractTokenFromHeader).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should verify token and throw error if it was not valid`, () => {
      const MOCKED_TOKEN = `some-random-token`;
      guard.extractTokenFromHeader = jest.fn().mockReturnValue(MOCKED_TOKEN);
      jwtService.verifyAccessToken = jest.fn().mockReturnValue(null);

      expect(async () => guard.validateRequest(req, i18n)).rejects.toThrow(
        InvalidTokenException,
      );
      expect(jwtService.verifyAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtService.verifyAccessToken).toHaveBeenCalledWith(MOCKED_TOKEN);
      expect.hasAssertions();
    });

    it(`should find the user and throw error if not found`, () => {
      const MOCKED_TOKEN = `some-random-token`;
      const TOKEN_PAYLOAD: IAccessTokenPayload = { id: 1 };
      guard.extractTokenFromHeader = jest.fn().mockReturnValue(MOCKED_TOKEN);
      jwtService.verifyAccessToken = jest.fn().mockReturnValue(TOKEN_PAYLOAD);
      guard.getUser = jest.fn().mockResolvedValue(null);

      expect(async () => guard.validateRequest(req, i18n)).rejects.toThrow(
        InvalidTokenException,
      );
      expect(guard.getUser).toHaveBeenCalledTimes(1);
      expect(guard.getUser).toHaveBeenCalledWith(TOKEN_PAYLOAD.id);
      expect.hasAssertions();
    });

    it(`should return the user if user is found`, async () => {
      const MOCKED_USER = { id: 1 };
      const MOCKED_TOKEN = `some-random-token`;
      const TOKEN_PAYLOAD: IAccessTokenPayload = { id: 1 };
      guard.extractTokenFromHeader = jest.fn().mockReturnValue(MOCKED_TOKEN);
      jwtService.verifyAccessToken = jest.fn().mockReturnValue(TOKEN_PAYLOAD);
      guard.getUser = jest.fn().mockResolvedValue(MOCKED_USER);

      expect(await guard.validateRequest(req, i18n)).toEqual(MOCKED_USER);
      expect.hasAssertions();
    });
  });
});
