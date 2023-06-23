import { PartialType } from "@nestjs/swagger";
import { CreateCompanyDto } from "./create-company.dto";
import { IsBoolean, IsOptional } from "class-validator";
import { CoreResponseDto } from "src/common/dto/common.dto";
import { COMPANY_IS_APPROVED_IS_NOT_VALID_MESSAGE } from "../constants/company.constants";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsOptional()
  @IsBoolean({ message: COMPANY_IS_APPROVED_IS_NOT_VALID_MESSAGE })
  isApproved?: boolean;
}

export class UpdateCompanyResponseDto extends CoreResponseDto {}
