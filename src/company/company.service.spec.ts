import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getName } from "i18n-iso-countries";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import {
  PrismaServiceMock,
  mockI18n,
  mockUser,
} from "src/common/utils/generator.utils";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { PrismaService } from "src/prisma/prisma.service";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { FindAllCompaniesQueryDto } from "./dto/find-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UserRole } from "@prisma/client";

jest.mock(`i18n-iso-countries`);
jest.mock(`src/common/utils/userVerified`, () => ({
  checkIfUserIsVerified: jest.fn(),
}));
const i18n = mockI18n();

describe(`CompanyService`, () => {
  let service: CompanyService;
  let prisma: PrismaServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useClass: PrismaServiceMock, // Use the mock implementation
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(
      PrismaService,
    ) as unknown as PrismaServiceMock;
  });

  afterEach(() => {
    jest.mocked(getName).mockClear();
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
      service.create(MOCKED_COMPANY, MOCKED_USER, i18n);

      expect(checkIfUserIsVerified).toHaveBeenCalledTimes(1);
      expect.hasAssertions();
    });

    it(`should create a company`, async () => {
      const result = await service.create(MOCKED_COMPANY, MOCKED_USER, i18n);

      expect(prisma.company.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect.hasAssertions();
    });
  });

  describe(`Find One`, () => {
    const MOCKED_USER = mockUser();
    it(`should find the company with id`, async () => {
      const MOCKED_COMPANY_ID = 1;
      prisma.company.findFirst.mockReturnValue({ id: MOCKED_COMPANY_ID });

      await service.findOne(MOCKED_COMPANY_ID, i18n, MOCKED_USER);

      expect(prisma.company.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.company.findFirst).toHaveBeenCalledWith({
        where: {
          id: MOCKED_COMPANY_ID,
          ...(MOCKED_USER.role !== UserRole.ADMIN && { isApproved: true }),
        },
      });
      expect.hasAssertions();
    });

    it(`should fail if the company is not found`, async () => {
      const MOCKED_COMPANY_ID = 1;
      prisma.company.findFirst.mockReturnValue(null);

      expect(
        async () => await service.findOne(MOCKED_COMPANY_ID, i18n, MOCKED_USER),
      ).rejects.toThrow(BadRequestException);
      expect.hasAssertions();
    });

    it(`should get the company name by its code `, async () => {
      const MOCKED_COMPANY_ID = 1;
      const MOCKED_COMPANY_COUNTRY = `US`;

      prisma.company.findFirst.mockReturnValue({
        id: MOCKED_COMPANY_ID,
        country: MOCKED_COMPANY_COUNTRY,
      });

      jest.mocked(getName).mockReturnValue(`United States`);

      await service.findOne(MOCKED_COMPANY_ID, i18n, MOCKED_USER);
      expect(getName).toHaveBeenCalled();
      expect(getName).toHaveBeenCalledWith(MOCKED_COMPANY_COUNTRY, i18n.lang);
    });

    it(`should return company`, async () => {
      const MOCKED_COMPANY_ID = 1;
      const MOCKED_COMPANY_COUNTRY = `US`;

      prisma.company.findFirst.mockReturnValue({
        id: MOCKED_COMPANY_ID,
        country: MOCKED_COMPANY_COUNTRY,
      });

      jest.mocked(getName).mockReturnValue(`United States`);

      const result = await service.findOne(
        MOCKED_COMPANY_ID,
        i18n,
        MOCKED_USER,
      );
      expect(result.success).toBe(true);
      expect.hasAssertions();
    });
  });

  describe(`Find All`, () => {
    const MOCKED_USER = mockUser();
    const getNameResult = `United States`;
    jest.mocked(getName).mockReturnValue(getNameResult);

    const companies = [
      { id: 1, name: `Company 1`, country: `USA` },
      { id: 2, name: `Company 2`, country: `Canada` },
    ];

    const queryDto: FindAllCompaniesQueryDto = {
      page: 1,
      limit: 10,
      searchQuery: `test`,
      country: `USA`,
      bookmark: false,
    };

    const totalCount = 2;

    it(`should search the companies and total count`, async () => {
      prisma.company.findMany.mockResolvedValue(companies);
      prisma.company.count.mockResolvedValue(totalCount);

      await service.findAll(queryDto, i18n, MOCKED_USER);

      expect(prisma.company.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.company.count).toHaveBeenCalledTimes(1);

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: {
          country: { contains: queryDto.country },
          name: { contains: queryDto.searchQuery, mode: `insensitive` },
          ...(queryDto.bookmark && {
            Bookmarks: { some: { userId: MOCKED_USER.id } },
          }),
          ...(MOCKED_USER.role !== UserRole.ADMIN && { isApproved: true }),
          ...(MOCKED_USER.role === UserRole.ADMIN &&
            typeof queryDto.isApproved !== `undefined` && {
              isApproved: queryDto.isApproved,
            }),
        },
        skip: 0,
        take: queryDto.limit,
      });
      expect(prisma.company.count).toHaveBeenCalledWith({
        where: {
          country: { contains: queryDto.country },
          name: { contains: queryDto.searchQuery, mode: `insensitive` },
          ...(queryDto.bookmark && {
            Bookmarks: { some: { userId: MOCKED_USER.id } },
          }),
          ...(MOCKED_USER.role !== UserRole.ADMIN && { isApproved: true }),
          ...(MOCKED_USER.role === UserRole.ADMIN &&
            typeof queryDto.isApproved !== `undefined` && {
              isApproved: queryDto.isApproved,
            }),
        },
      });
      expect.hasAssertions();
    });

    it(`should get the country names`, async () => {
      prisma.company.findMany.mockResolvedValue(companies);
      prisma.company.count.mockResolvedValue(totalCount);

      await service.findAll(queryDto, i18n, MOCKED_USER);

      expect(getName).toHaveBeenCalledTimes(companies.length);
      expect.hasAssertions();
    });

    it(`should return the companies`, async () => {
      prisma.company.findMany.mockResolvedValue(companies);
      prisma.company.count.mockResolvedValue(totalCount);

      const result = await service.findAll(queryDto, i18n, MOCKED_USER);
      expect(result).toEqual({
        ...CORE_SUCCESS_DTO,
        items: companies.map((company) => ({
          ...company,
          countryName: getNameResult,
        })),
        totalCount,
      });
    });
  });

  describe(`Remove`, () => {
    const MOCKED_USER = mockUser();

    const COMPANY_ID = 1;
    it(`should find the company and delete it`, async () => {
      service.findOne = jest.fn().mockReturnValue({ id: COMPANY_ID });

      const result = await service.remove(COMPANY_ID, i18n, MOCKED_USER);
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(prisma.company.delete).toHaveBeenCalledTimes(1);
      expect(prisma.company.delete).toHaveBeenCalledWith({
        where: { id: COMPANY_ID },
      });
      expect.hasAssertions();
    });
  });

  describe(`Update`, () => {
    const MOCKED_USER = mockUser();

    const MOCKED_COMPANY = {
      id: 1,
      countryName: `United States`,
      name: `test`,
    };

    const UPDATE_COMPANY_DTO: UpdateCompanyDto = {
      name: `new name`,
    };

    it(`should find the company and update it`, async () => {
      service.findOne = jest.fn().mockReturnValue({ company: MOCKED_COMPANY });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { countryName, ...COMPANY } = MOCKED_COMPANY;

      const result = await service.update(
        MOCKED_COMPANY.id,
        UPDATE_COMPANY_DTO,
        i18n,
        MOCKED_USER,
      );
      expect(result).toEqual(CORE_SUCCESS_DTO);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(prisma.company.update).toHaveBeenCalledTimes(1);
      expect(prisma.company.update).toHaveBeenCalledWith({
        where: { id: MOCKED_COMPANY.id },
        data: {
          ...COMPANY,
          ...UPDATE_COMPANY_DTO,
        },
      });
      expect.hasAssertions();
    });
  });
});
