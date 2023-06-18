import { Test, TestingModule } from "@nestjs/testing";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { mockI18n, mockUser } from "src/common/utils/generator.utils";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { PrismaService } from "src/prisma/prisma.service";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

const i18n = mockI18n();
jest.mock(`src/common/utils/userVerified`, () => ({
  checkIfUserIsVerified: jest.fn(),
}));

describe(`CompanyService`, () => {
  let service: CompanyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
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

    it(`should fail if user is not verified`, () => {
      prisma.company.create = jest.fn();
      service.create(MOCKED_COMPANY, MOCKED_USER, i18n);

      expect(checkIfUserIsVerified).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should create a company`, async () => {
      prisma.company.create = jest.fn();

      const result = await service.create(MOCKED_COMPANY, MOCKED_USER, i18n);

      expect(prisma.company.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect.hasAssertions();
    });
  });
});
