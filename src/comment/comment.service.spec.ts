import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "./comment.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { BadRequestException } from "@nestjs/common";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";

const i18n = mockI18n();
const MOCKED_USER = mockUser();

describe(`CommentService`, () => {
  let service: CommentService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    service = module.get<CommentService>(CommentService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`Create`, () => {
    const MOCKED_DTO: CreateCommentDto = {
      companyId: 1,
      parentId: 1,
      message: `Hello`,
    };

    it(`should check for company and throw error if it is not found`, () => {
      prisma.company.findFirst.mockReturnValue(null);

      expect(
        async () => await service.create(MOCKED_DTO, i18n, MOCKED_USER),
      ).rejects.toThrowError(BadRequestException);

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: { id: MOCKED_DTO.companyId },
      });
      expect.hasAssertions();
    });

    it(`should check for parentId if exists in dto and throw error if not found`, () => {
      prisma.company.findFirst.mockReturnValue({ id: MOCKED_DTO.companyId });
      prisma.comment.findFirst.mockReturnValue(null);

      expect(
        async () => await service.create(MOCKED_DTO, i18n, MOCKED_USER),
      ).rejects.toThrowError(BadRequestException);

      expect(prisma.comment.findFirst).toHaveBeenCalled();
      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: MOCKED_DTO.parentId },
      });
      expect.hasAssertions();
    });

    it(`should create the comment and return success`, async () => {
      prisma.company.findFirst.mockReturnValue({ id: MOCKED_DTO.companyId });
      prisma.comment.findFirst.mockReturnValue({ id: MOCKED_DTO.parentId });

      expect(await service.create(MOCKED_DTO, i18n, MOCKED_USER)).toEqual(
        CORE_SUCCESS_DTO,
      );

      expect(prisma.comment.create).toHaveBeenCalledTimes(1);
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          message: MOCKED_DTO.message,
          userId: MOCKED_USER.id,
          companyId: MOCKED_DTO.companyId,
          parentId: MOCKED_DTO.parentId ?? null,
        },
      });
      expect.hasAssertions();
    });
  });
});
