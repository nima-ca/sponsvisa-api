import { Company } from "@prisma/client";
import { Transform } from "class-transformer";
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
  country?: string;

  @IsOptional()
  @Transform(({ value }) => value === `true`)
  bookmark?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === `true`)
  isApproved?: boolean;
}

export type CompanyWithCompanyName = Company & {
  countryName: string;
};

export class FindAllCompaniesResponseDto
  implements ICoreFindAllResponseDto<CompanyWithCompanyName>
{
  errors: string[];
  items: CompanyWithCompanyName[];
  success: boolean;
  totalCount: number;
}
