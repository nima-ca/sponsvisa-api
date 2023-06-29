import { Test, TestingModule } from "@nestjs/testing";
import { BookmarkController } from "./bookmark.controller";
import { BookmarkService } from "./bookmark.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaServiceMock } from "src/common/utils/generator.utils";

describe(`BookmarkController`, () => {
  let controller: BookmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        BookmarkService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
  });

  it(`should be defined`, () => {
    expect(controller).toBeDefined();
  });
});
