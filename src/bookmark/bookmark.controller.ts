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
import { setRole } from "src/common/decorators/setRole.decorator";
import { RemoveBookmarkResponseDto } from "./dto/remove-bookmark.dto";

@Controller(`bookmark`)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @setRole([`ANY`])
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateBookmarkResponseDto> {
    return this.bookmarkService.create(createBookmarkDto, user, i18n);
  }

  @Get()
  @setRole([`ANY`])
  findAll() {
    return this.bookmarkService.findAll();
  }

  @Delete(`:id`)
  @setRole([`ANY`])
  remove(
    @Param(`id`) id: string,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<RemoveBookmarkResponseDto> {
    return this.bookmarkService.remove(+id, user, i18n);
  }
}
