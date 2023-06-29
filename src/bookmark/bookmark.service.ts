import { Injectable } from "@nestjs/common";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";

@Injectable()
export class BookmarkService {
  create(createBookmarkDto: CreateBookmarkDto) {
    return `This action adds a new bookmark`;
  }

  findAll() {
    return `This action returns all bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
