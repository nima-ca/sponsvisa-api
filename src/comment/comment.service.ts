import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CreateCommentDto,
  CreateCommentResponseDto,
} from "./dto/create-comment.dto";
import {
  UpdateCommentDto,
  UpdateCommentResponseDto,
} from "./dto/update-comment.dto";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { companyId, message, parentId }: CreateCommentDto,
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

    if (parentId) {
      const parentComment = await this.prisma.comment.findFirst({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new BadRequestException(
          i18n.t(`comment.exceptions.commentNotFound`),
        );
      }
    }

    await this.prisma.comment.create({
      data: {
        message,
        userId: user.id,
        companyId: company.id,
        parentId: parentId ?? null,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<UpdateCommentResponseDto> {
    const comment = await this.prisma.comment.findFirst({
      where: { id },
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

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
