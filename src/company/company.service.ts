import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { checkIfUserIsVerified } from "src/common/utils/userVerified";
import { I18nTranslations } from "src/generated/i18n.generated";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
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
      },
    });

    return CORE_SUCCESS_DTO;
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
