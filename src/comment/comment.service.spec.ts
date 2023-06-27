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
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { UserRole } from "@prisma/client";

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

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    jest.clearAllMocks();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`Create`, () => {
    const MOCKED_DTO: CreateCommentDto = {
      companyId: 50,
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

    it(`should create the comment and return success`, async () => {
      prisma.company.findFirst.mockReturnValue({ id: MOCKED_DTO.companyId });

      expect(await service.create(MOCKED_DTO, i18n, MOCKED_USER)).toEqual(
        CORE_SUCCESS_DTO,
      );

      expect(prisma.comment.create).toHaveBeenCalledTimes(1);
      expect(prisma.comment.create).toHaveBeenCalledWith({
        data: {
          message: MOCKED_DTO.message,
          userId: MOCKED_USER.id,
          companyId: MOCKED_DTO.companyId,
        },
      });
      expect.hasAssertions();
    });
  });

  describe(`Update`, () => {
    it(`should update the comment when it exists`, async () => {
      const id = 1;
      const updateCommentDto: UpdateCommentDto = {
        message: `Updated message`,
      };

      prisma.comment.findFirst.mockReturnValue({
        id: 1,
        message: `Original message`,
      });

      const result = await service.update(
        id,
        updateCommentDto,
        i18n,
        MOCKED_USER,
      );

      expect(prisma.comment.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: {
          id,
          ...(MOCKED_USER.role !== UserRole.ADMIN && {
            userId: MOCKED_USER.id,
          }),
        },
      });

      expect(prisma.comment.update).toHaveBeenCalledTimes(1);
      expect(prisma.comment.update).toHaveBeenCalledWith({
        where: { id },
        data: updateCommentDto,
      });

      expect(result).toEqual(CORE_SUCCESS_DTO);
    });

    it(`should throw BadRequestException when the comment does not exist`, async () => {
      const id = 1;
      const updateCommentDto: UpdateCommentDto = {
        message: `Updated message`,
      };

      prisma.comment.findFirst.mockReturnValue(null);

      await expect(
        service.update(id, updateCommentDto, i18n, MOCKED_USER),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe(`Remove`, () => {
    it(`should remove a comment and return Success`, async () => {
      const id = 1;
      const comment = { id: 1 };

      prisma.comment.findFirst.mockResolvedValue(comment);

      const result = await service.remove(id, i18n);

      expect(prisma.comment.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.comment.findFirst).toHaveBeenCalledWith({ where: { id } });
      expect(prisma.comment.delete).toHaveBeenCalledTimes(1);
      expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(CORE_SUCCESS_DTO);
    });

    it(`should throw Error if comment is not found`, async () => {
      const id = 1;
      prisma.comment.findFirst.mockResolvedValue(null);

      await expect(service.remove(id, i18n)).rejects.toThrowError(
        BadRequestException,
      );
      expect(prisma.comment.findFirst).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
