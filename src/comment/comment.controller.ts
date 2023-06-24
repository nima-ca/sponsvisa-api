import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { User } from "@prisma/client";
import { setRole } from "src/common/decorators/setRole.decorator";

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

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(`:id`)
  findOne(@Param(`id`) id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(`:id`)
  remove(@Param(`id`) id: string) {
    return this.commentService.remove(+id);
  }
}
