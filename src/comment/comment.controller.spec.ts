import { Test, TestingModule } from "@nestjs/testing";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { PrismaServiceMock } from "src/common/utils/generator.utils";
import { PrismaService } from "src/prisma/prisma.service";

describe(`CommentController`, () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it(`should be defined`, () => {
    expect(controller).toBeDefined();
  });
});
