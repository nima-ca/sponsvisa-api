import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "./comment.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaServiceMock } from "src/common/utils/generator.utils";

describe(`CommentService`, () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });
});
