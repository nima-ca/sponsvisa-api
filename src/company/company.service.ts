import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { FindOneCompanyResponseDto } from "./dto/find-company.dto";
import { getName } from "i18n-iso-countries";

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

  findAll() {
    return `This action returns all company`;
  }

  async findOne(
    id: number,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<FindOneCompanyResponseDto> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
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

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
