import { Company } from "@prisma/client";
import { IsOptional } from "class-validator";
import {
  CoreResponseDto,
  ICoreFindAllResponseDto,
  PaginationQueryWithSearchDto,
} from "src/common/dto/common.dto";

export class FindOneCompanyResponseDto extends CoreResponseDto {
  company:
    | (Company & {
        countryName: string;
      })
    | null;
}

export class FindAllCompaniesQueryDto extends PaginationQueryWithSearchDto {
  @IsOptional()
  country: string;
}

export type CompanyWithCompanyName = Company & {
  countryName: string;
};

export class FindAllCompaniesResponseDto
  implements ICoreFindAllResponseDto<CompanyWithCompanyName>
{
  error: string[];
  items: CompanyWithCompanyName[];
  success: boolean;
  totalCount: number;
}
