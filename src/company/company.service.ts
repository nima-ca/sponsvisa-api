import { BadRequestException, Injectable } from "@nestjs/common";
import { User, UserRole } from "@prisma/client";
import { getName } from "i18n-iso-countries";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { PrismaService } from "src/prisma/prisma.service";
import {
  COMPANY_FIND_ALL_LIMIT_DEFAULT_VALUE,
  COMPANY_FIND_ALL_PAGES_DEFAULT_VALUE,
} from "./constants/company.constants";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from "./dto/create-company.dto";
import {
  CompanyWithCompanyName,
  FindAllCompaniesQueryDto,
  FindAllCompaniesResponseDto,
  FindOneCompanyResponseDto,
} from "./dto/find-company.dto";
import {
  UpdateCompanyDto,
  UpdateCompanyResponseDto,
} from "./dto/update-company.dto";
import { DeleteCompanyResponseDto } from "./dto/delete-company.dto";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: User,
    I18n: I18nContext<I18nTranslations>,
  ): Promise<CreateCompanyResponseDto> {
    checkIfUserIsVerified(user, I18n);

    await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        userId: user.id,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  async findAll(
    {
      page = COMPANY_FIND_ALL_PAGES_DEFAULT_VALUE,
      limit = COMPANY_FIND_ALL_LIMIT_DEFAULT_VALUE,
      searchQuery = ``,
      country = ``,
      isApproved,
      bookmark,
    }: FindAllCompaniesQueryDto,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<FindAllCompaniesResponseDto> {
    const skip = (page - 1) * limit;

    const isLoggedIn = !!user;
    const isUserAdmin = isLoggedIn && user.role === UserRole.ADMIN;
    const isApprovedProvidedByAdmin =
      isUserAdmin && typeof isApproved !== `undefined`;
    const companies = await this.prisma.company.findMany({
      where: {
        country: {
          contains: country,
        },
        name: {
          contains: searchQuery,
          mode: `insensitive`,
        },
        ...(isLoggedIn &&
          bookmark && {
            Bookmarks: {
              some: { userId: user.id },
            },
          }),
        ...(!isUserAdmin && { isApproved: true }),
        ...(isApprovedProvidedByAdmin && { isApproved }),
      },
      skip,
      take: limit,
    });

    const totalCount = await this.prisma.company.count({
      where: {
        country: {
          contains: country,
        },
        name: {
          contains: searchQuery,
          mode: `insensitive`,
        },
        ...(isLoggedIn &&
          bookmark && {
            Bookmarks: {
              some: { userId: user.id },
            },
          }),
        ...(!isUserAdmin && { isApproved: true }),
        ...(isApprovedProvidedByAdmin && { isApproved }),
      },
    });

    const companiesWithCountryName: CompanyWithCompanyName[] = companies.map(
      (company) => ({
        ...company,
        countryName: getName(company.country, i18n.lang),
      }),
    );

    return { ...CORE_SUCCESS_DTO, items: companiesWithCountryName, totalCount };
  }

  async findOne(
    id: number,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<FindOneCompanyResponseDto> {
    const isUserAdmin = user && user.role === UserRole.ADMIN;

    const company = await this.prisma.company.findFirst({
      where: {
        id,
        ...(!isUserAdmin && { isApproved: true }),
      },
    });

    if (!company) {
      const CompanyNotFoundError = i18n.t(`company.exceptions.companyNotFound`);
      throw new BadRequestException(CompanyNotFoundError);
    }

    // get country name by its code
    const countryName = getName(company.country, i18n.lang);

    return { success: true, error: null, company: { ...company, countryName } };
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<UpdateCompanyResponseDto> {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      company: { countryName, ...company },
    } = await this.findOne(id, i18n, user);

    await this.prisma.company.update({
      where: { id },
      data: {
        ...company,
        ...updateCompanyDto,
      },
    });

    return CORE_SUCCESS_DTO;
  }

  async remove(
    id: number,
    i18n: I18nContext<I18nTranslations>,
    user: User,
  ): Promise<DeleteCompanyResponseDto> {
    // it finds the company or throws an error
    await this.findOne(id, i18n, user);

    // delete the company
    await this.prisma.company.delete({
      where: { id },
    });

    return CORE_SUCCESS_DTO;
  }
}
