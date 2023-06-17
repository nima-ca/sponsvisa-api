import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { I18n, I18nContext } from "nestjs-i18n";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { setRole } from "src/common/decorators/setRole.decorator";
import { I18nTranslations } from "src/generated/i18n.generated";
import { CompanyService } from "./company.service";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller(`company`)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @setRole([`ANY`])
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateCompanyResponseDto> {
    return await this.companyService.create(createCompanyDto, user, i18n);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(`:id`)
  findOne(@Param(`id`) id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(`:id`)
  update(@Param(`id`) id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(`:id`)
  remove(@Param(`id`) id: string) {
    return this.companyService.remove(+id);
  }
}
