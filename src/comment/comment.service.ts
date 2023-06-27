import { BadRequestException, Injectable } from "@nestjs/common";
import { User, UserRole, VoteStatus } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateCommentDto,
  CreateCommentResponseDto,
} from "./dto/create-comment.dto";
import { DeleteCommentResponseDto } from "./dto/delete-comment.dto";
import {
  FindAllCommentsQueryDto,
  FindAllCommentsResponseDto,
} from "./dto/find-comment.dto";
import {
  UpdateCommentDto,
  UpdateCommentResponseDto,
} from "./dto/update-comment.dto";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { companyId, message }: CreateCommentDto,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<CreateCommentResponseDto> {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException(
        i18n.t(`comment.exceptions.companyNotFound`),
      );
    }

    await this.prisma.comment.create({
      data: {
        message,
        userId: user.id,
        companyId: company.id,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  async findAll(
    id: number,
    { limit, page }: FindAllCommentsQueryDto,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<FindAllCommentsResponseDto> {
    const skip = (page - 1) * limit;
    const take = limit;

    const company = await this.prisma.company.findFirst({ where: { id } });
    if (!company) {
      throw new BadRequestException(
        i18n.t(`comment.exceptions.companyNotFound`),
      );
    }

    const totalCount = await this.prisma.comment.count({
      where: { companyId: id },
    });

    const comments = await this.prisma.comment.findMany({
      where: { companyId: id },
      include: {
        votes: {
          select: {
            vote: true,
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: `asc`,
      },
      skip,
      take,
    });

    const _comments = comments.map((comment) => {
      const userVote = user
        ? comment.votes.find((vote) => vote.userId === user.id)?.vote
        : undefined;

      const upVotes = comment.votes.filter(
        ({ vote }) => vote === VoteStatus.UpVote,
      ).length;

      const downVotes = comment.votes.length - upVotes;

      return {
        id: comment.id,
        message: comment.message,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        companyId: comment.companyId,
        userVote,
        upVotes,
        downVotes,
        author: comment.user,
      };
    });

    return {
      ...CORE_SUCCESS_DTO,
      comments: _comments,
      totalCount,
    };
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<UpdateCommentResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, ...(user.role !== UserRole.ADMIN && { userId: user.id }) },
    });

    if (!comment) {
      throw new BadRequestException(
        i18n.t(`comment.exceptions.commentNotFound`),
      );
    }

    await this.prisma.comment.update({
      where: { id },
      data: {
        ...updateCommentDto,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  async remove(
    id: number,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<DeleteCommentResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id },
    });

    if (!comment) {
      throw new BadRequestException(
        i18n.t(`comment.exceptions.commentNotFound`),
      );
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    return CORE_SUCCESS_DTO;
  }
}
