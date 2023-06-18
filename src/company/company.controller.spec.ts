import { Test, TestingModule } from "@nestjs/testing";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { mockI18n, mockUser } from "src/common/utils/generator.utils";
import { PrismaService } from "src/prisma/prisma.service";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

const i18n = mockI18n();

describe(`CompanyController`, () => {
  let controller: CompanyController;
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService, PrismaService],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it(`should be defined`, () => {
    expect(controller).toBeDefined();
  });

  describe(`Create`, () => {
    const MOCKED_USER = mockUser();
    const MOCKED_COMPANY: CreateCompanyDto = {
      country: `US`,
      description: `test`,
      linkedin: `linkedin.com`,
      name: `amazon`,
      supportsSponsorshipProgram: `YES`,
      website: `amazon.com`,
    };

    it(`should register a new user`, async () => {
      jest
        .spyOn(service, `create`)
        .mockImplementation(async () => CORE_SUCCESS_DTO);
      expect(await controller.create(MOCKED_COMPANY, MOCKED_USER, i18n)).toBe(
        CORE_SUCCESS_DTO,
      );
    });
  });
});
