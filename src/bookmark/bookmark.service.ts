import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CreateBookmarkDto,
  CreateBookmarkResponseDto,
} from "./dto/create-bookmark.dto";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { I18nContext } from "nestjs-i18n";

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    { companyId }: CreateBookmarkDto,
    user: User,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateBookmarkResponseDto> {
    const company = this.prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException(
        i18n.t(`bookmark.exceptions.companyNotFound`),
      );
    }

    const isAlreadyBookmarked = await this.prisma.bookmarks.findFirst({
      where: { userId: user.id, companyId },
    });
    if (isAlreadyBookmarked) return CORE_SUCCESS_DTO;

    await this.prisma.bookmarks.create({
      data: { companyId, userId: user.id },
    });

    return CORE_SUCCESS_DTO;
  }

  findAll() {
    return `This action returns all bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
