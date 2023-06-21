import { Test, TestingModule } from "@nestjs/testing";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { mockI18n, mockUser } from "src/common/utils/generator.utils";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { PrismaService } from "src/prisma/prisma.service";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { BadRequestException } from "@nestjs/common";
import { getName } from "i18n-iso-countries";

jest.mock(`i18n-iso-countries`);
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

  describe(`Create`, () => {
    const FIND_ONE_RESPONSE = {
      company: { id: 1 },
      error: null,
      success: true,
    };

    it(`should find the company with id`, async () => {
      const MOCKED_COMPANY_ID = 1;
      prisma.company.findUnique = jest
        .fn()
        .mockReturnValue({ id: MOCKED_COMPANY_ID });

      await service.findOne(MOCKED_COMPANY_ID, i18n);

      expect(prisma.company.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { id: MOCKED_COMPANY_ID },
      });
      expect.hasAssertions();
    });

    it(`should fail if the company is not found`, async () => {
      const MOCKED_COMPANY_ID = 1;
      prisma.company.findUnique = jest.fn().mockReturnValue(null);

      expect(
        async () => await service.findOne(MOCKED_COMPANY_ID, i18n),
      ).rejects.toThrow(BadRequestException);
      expect.hasAssertions();
    });

    it(`should get the company name by its code `, async () => {
      const MOCKED_COMPANY_ID = 1;
      const MOCKED_COMPANY_COUNTRY = `US`;

      prisma.company.findUnique = jest.fn().mockReturnValue({
        id: MOCKED_COMPANY_ID,
        country: MOCKED_COMPANY_COUNTRY,
      });

      jest.mocked(getName).mockReturnValue(`United States`);

      await service.findOne(MOCKED_COMPANY_ID, i18n);
      expect(getName).toHaveBeenCalled();
      expect(getName).toHaveBeenCalledWith(MOCKED_COMPANY_COUNTRY, i18n.lang);
    });

    it(`should return company`, async () => {
      const MOCKED_COMPANY_ID = 1;
      const MOCKED_COMPANY_COUNTRY = `US`;

      prisma.company.findUnique = jest.fn().mockReturnValue({
        id: MOCKED_COMPANY_ID,
        country: MOCKED_COMPANY_COUNTRY,
      });

      jest.mocked(getName).mockReturnValue(`United States`);

      const result = await service.findOne(MOCKED_COMPANY_ID, i18n);
      expect(result.success).toBe(true);
      expect.hasAssertions();
    });
  });
});
