import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { I18nContext } from "nestjs-i18n/dist/i18n.context";
import {
  ROLE_METADATA_KEY,
  Roles,
} from "src/common/decorators/setRole.decorator";
import { mockI18n } from "src/common/utils/generator.utils";
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useValue: mockReflector(),
        },
        AuthGuard,
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
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

    it(`should check for the user in request if role metadata is provided and throw Error if not found`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([]);
      guard.getUser = jest.fn().mockReturnValue(null);

      expect(async () => await guard.canActivate(context)).rejects.toThrowError(
        InvalidTokenException,
      );

      expect.hasAssertions();
    });

    it(`should return true if metadata role is empty and user is found`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([]);
      guard.getUser = jest.fn().mockReturnValue(MOCKED_USER);

      expect(await guard.canActivate(context)).toBe(true);
      expect.hasAssertions();
    });

    it(`should return true if metadata role is "ANY"`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([`ANY`]);
      guard.getUser = jest.fn().mockReturnValue(MOCKED_USER);

      expect(await guard.canActivate(context)).toBe(true);
      expect.hasAssertions();
    });

    it(`should throw ForbiddenException if the user role in not in metadata role`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([UserRole.USER]);
      guard.getUser = jest.fn().mockReturnValue(MOCKED_USER);

      expect(async () => await guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
      expect.hasAssertions();
    });

    it(`should return true if the user role matches metadata role`, async () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest.fn().mockReturnValue([MOCKED_USER.role]);
      guard.getUser = jest.fn().mockReturnValue(MOCKED_USER);

      expect(await guard.canActivate(context)).toBe(true);
      expect.hasAssertions();
    });
  });
});
