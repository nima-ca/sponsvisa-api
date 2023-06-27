import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateVoteDto, CreateVoteResponseDto } from "./dto/create-vote.dto";
import { User } from "@prisma/client";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(
    { commentId, status }: CreateVoteDto,
    user: User,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateVoteResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      throw new BadRequestException(
        i18n.t(`comment.exceptions.commentNotFound`),
      );
    }

    await this.prisma.vote.upsert({
      where: { userId_commentId: { commentId: comment.id, userId: user.id } },
      create: {
        userId: user.id,
        commentId: comment.id,
        vote: status,
      },
      update: {
        vote: status,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
