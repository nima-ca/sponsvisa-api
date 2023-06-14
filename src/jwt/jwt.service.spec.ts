import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";

describe(`JwtService`, () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, ConfigService],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });
});
