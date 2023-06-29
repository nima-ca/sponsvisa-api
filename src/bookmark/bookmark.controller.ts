import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { BookmarkService } from "./bookmark.service";
import {
  CreateBookmarkDto,
  CreateBookmarkResponseDto,
} from "./dto/create-bookmark.dto";
import { User } from "@prisma/client";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

@Controller(`bookmark`)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateBookmarkResponseDto> {
    return this.bookmarkService.create(createBookmarkDto, user, i18n);
  }

  @Get()
  findAll() {
    return this.bookmarkService.findAll();
  }

  @Delete(`:id`)
  remove(@Param(`id`) id: string) {
    return this.bookmarkService.remove(+id);
  }
}
