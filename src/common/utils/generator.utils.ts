import { User, UserRole } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

export const stringGenerator = (length: number, character): string =>
  new Array(length + 1).join(character);

export const mockUser = (
  user = {
    id: 1,
    createdAt: new Date(),
    email: `user@test.com`,
    isVerified: true,
    name: `test`,
    password: ``,
    role: UserRole.USER,
  },
): User => user;

export const mockI18n = () =>
  ({
    t: jest.fn().mockReturnValue(`random translated text`),
    lang: `en`,
  } as unknown as I18nContext<I18nTranslations>);

export class PrismaServiceMock {
  // Define mock methods and properties that you need for testing
  public company = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
  };
  public vote = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
  };
  public user = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
  };
  public log = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
  };
  public comment = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn(),
  };
}
