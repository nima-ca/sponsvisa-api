import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { BookmarkService } from "./bookmark.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";

@Controller(`bookmark`)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.create(createBookmarkDto);
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
