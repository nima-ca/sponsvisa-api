import { Test, TestingModule } from "@nestjs/testing";
import { VoteService } from "./vote.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { I18nContext } from "nestjs-i18n";
import { User, VoteStatus } from "@prisma/client";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { BadRequestException } from "@nestjs/common";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";

describe(`VoteService`, () => {
  let service: VoteService;
  let prisma: PrismaServiceMock;
  let i18n: I18nContext<I18nTranslations>;
  let MOCKED_USER: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
    i18n = mockI18n();
    MOCKED_USER = mockUser();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe(`createOrUpdate`, () => {
    const MOCKED_VOTE_DTO: CreateVoteDto = {
      commentId: 1,
      status: VoteStatus.UpVote,
    };

    it(`should throw BadRequestException when the comment does not exist`, async () => {
      prisma.comment.findFirst.mockResolvedValue(null);

      await expect(
        service.createOrUpdate(MOCKED_VOTE_DTO, MOCKED_USER, i18n),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: MOCKED_VOTE_DTO.commentId },
      });
    });

    it(`should create or update the vote`, async () => {
      prisma.comment.findFirst.mockResolvedValue({
        id: MOCKED_VOTE_DTO.commentId,
      });

      const result = await service.createOrUpdate(
        MOCKED_VOTE_DTO,
        MOCKED_USER,
        i18n,
      );

      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: MOCKED_VOTE_DTO.commentId },
      });
      expect(prisma.vote.upsert).toHaveBeenCalledWith({
        where: {
          userId_commentId: {
            commentId: MOCKED_VOTE_DTO.commentId,
            userId: MOCKED_USER.id,
          },
        },
        create: {
          commentId: MOCKED_VOTE_DTO.commentId,
          userId: MOCKED_USER.id,
          vote: MOCKED_VOTE_DTO.status,
        },
        update: { vote: MOCKED_VOTE_DTO.status },
      });

      expect(result).toEqual(CORE_SUCCESS_DTO);

      expect.hasAssertions();
    });
  });

  describe(`Remove`, () => {
    const MOCKED_ID = 1;
    it(`should throw BadRequestException when the comment does not exist`, async () => {
      prisma.comment.findFirst.mockResolvedValue(null);

      await expect(
        service.remove(MOCKED_ID, MOCKED_USER, i18n),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.comment.findFirst).toHaveBeenCalledWith({
        where: { id: MOCKED_ID },
      });
    });

    it(`should delete the vote`, async () => {
      prisma.comment.findFirst.mockResolvedValue({ id: MOCKED_ID });

      const result = await service.remove(MOCKED_ID, MOCKED_USER, i18n);

      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(prisma.vote.delete).toHaveBeenCalledWith({
        where: {
          userId_commentId: { commentId: MOCKED_ID, userId: MOCKED_USER.id },
        },
      });
      expect.hasAssertions();
    });
  });
});
