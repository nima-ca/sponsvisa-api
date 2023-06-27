import { Test, TestingModule } from "@nestjs/testing";
import { VoteController } from "./vote.controller";
import { VoteService } from "./vote.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaServiceMock } from "src/common/utils/generator.utils";

describe(`VoteController`, () => {
  let controller: VoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [
        VoteService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    controller = module.get<VoteController>(VoteController);
  });

  it(`should be defined`, () => {
    expect(controller).toBeDefined();
  });
});
