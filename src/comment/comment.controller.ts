import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { setRole } from "src/common/decorators/setRole.decorator";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { DeleteCommentResponseDto } from "./dto/delete-comment.dto";
import { FindAllCommentsQueryDto } from "./dto/find-comment.dto";
import {
  UpdateCommentDto,
  UpdateCommentResponseDto,
} from "./dto/update-comment.dto";

@Controller({
  version: `1`,
  path: `comment`,
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @setRole([`ANY`])
  create(
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    return this.commentService.create(createCommentDto, i18n, user);
  }

  @Get(`:id`)
  async findAll(
    @Param(`id`) id: string,
    @Query() query: FindAllCommentsQueryDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @AuthUser() user: User,
  ) {
    return await this.commentService.findAll(+id, query, i18n, user);
  }

  @Patch(`:id`)
  @setRole([`USER`])
  update(
    @Param(`id`) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
    @AuthUser() user: User,
  ): Promise<UpdateCommentResponseDto> {
    return this.commentService.update(+id, updateCommentDto, i18n, user);
  }

  @Delete(`:id`)
  @setRole([`ADMIN`])
  remove(
    @Param(`id`) id: string,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<DeleteCommentResponseDto> {
    return this.commentService.remove(+id, i18n);
  }
}
