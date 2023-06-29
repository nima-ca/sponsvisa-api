import { Test, TestingModule } from "@nestjs/testing";
import { BookmarkService } from "./bookmark.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BadRequestException } from "@nestjs/common";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";

describe(`BookmarkService`, () => {
  let service: BookmarkService;
  let prisma: PrismaServiceMock;
  let i18n: I18nContext<I18nTranslations>;
  let MOCKED_USER: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    service = module.get<BookmarkService>(BookmarkService);
    i18n = mockI18n();
    MOCKED_USER = mockUser();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(i18n).toBeDefined();
    expect(MOCKED_USER).toBeDefined();
  });

  describe(`create`, () => {
    const dto: CreateBookmarkDto = { companyId: 1 };
    it(`should throw error if company does not exist`, async () => {
      prisma.company.findFirst.mockReturnValue(null);
      await expect(service.create(dto, MOCKED_USER, i18n)).rejects.toThrowError(
        BadRequestException,
      );

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: dto.companyId },
      });
      expect.hasAssertions();
    });

    it(`should return if the bookmark exists`, async () => {
      prisma.company.findFirst.mockReturnValue({ id: dto.companyId });
      prisma.bookmarks.findFirst.mockReturnValue({ id: 5 });

      const result = await service.create(dto, MOCKED_USER, i18n);

      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(prisma.bookmarks.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.bookmarks.findFirst).toHaveBeenCalledWith({
        where: { userId: MOCKED_USER.id, companyId: dto.companyId },
      });
      expect(prisma.bookmarks.create).not.toHaveBeenCalled();
      expect.hasAssertions();
    });

    it(`should create bookmark`, async () => {
      prisma.company.findFirst.mockReturnValue({ id: dto.companyId });
      prisma.bookmarks.findFirst.mockReturnValue(null);

      const result = await service.create(dto, MOCKED_USER, i18n);

      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(prisma.bookmarks.create).toHaveBeenCalledTimes(1);
      expect(prisma.bookmarks.create).toHaveBeenCalledWith({
        data: { companyId: dto.companyId, userId: MOCKED_USER.id },
      });
      expect.hasAssertions();
    });
  });

  describe(`Remove`, () => {
    const ID = 1;
    it(`should throw error if the company is not found`, async () => {
      prisma.company.findFirst.mockReturnValue(null);
      await expect(service.remove(ID, MOCKED_USER, i18n)).rejects.toThrowError(
        BadRequestException,
      );

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: ID },
      });
      expect.hasAssertions();
    });

    it(`should remove all the bookmarks for the company and user`, async () => {
      prisma.company.findFirst.mockReturnValue({ id: ID });

      const result = await service.remove(ID, MOCKED_USER, i18n);
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(prisma.bookmarks.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.bookmarks.deleteMany).toHaveBeenCalledWith({
        where: { companyId: ID, userId: MOCKED_USER.id },
      });
    });
  });
});
