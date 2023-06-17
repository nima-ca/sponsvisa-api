import { SponsorshipSupport } from "@prisma/client";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { IsCountryCodeValid } from "src/common/decorators/is-country-valid.decorator";
import { CoreResponseDto } from "src/common/dto/common.dto";
import {
  COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE,
  COMPANY_DESCRIPTION_IS_NOT_VALID_MESSAGE,
  COMPANY_DESCRIPTION_MAX_LENGTH,
  COMPANY_DESCRIPTION_MAX_LENGTH_MESSAGE,
  COMPANY_DESCRIPTION_MIN_LENGTH,
  COMPANY_DESCRIPTION_MIN_LENGTH_MESSAGE,
  COMPANY_LINKEDIN_IS_NOT_VALID_MESSAGE,
  COMPANY_NAME_IS_NOT_VALID_MESSAGE,
  COMPANY_NAME_MAX_LENGTH,
  COMPANY_NAME_MAX_LENGTH_MESSAGE,
  COMPANY_SPONSORSHIP_IS_NOT_VALID_MESSAGE,
  COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE,
} from "../constants/company.constants";

export class CreateCompanyDto {
  @IsDefined({ message: COMPANY_NAME_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMPANY_NAME_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMPANY_NAME_IS_NOT_VALID_MESSAGE })
  @MaxLength(COMPANY_NAME_MAX_LENGTH, {
    message: COMPANY_NAME_MAX_LENGTH_MESSAGE,
  })
  name: string;

  @IsDefined({ message: COMPANY_DESCRIPTION_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMPANY_DESCRIPTION_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMPANY_DESCRIPTION_IS_NOT_VALID_MESSAGE })
  @MinLength(COMPANY_DESCRIPTION_MIN_LENGTH, {
    message: COMPANY_DESCRIPTION_MIN_LENGTH_MESSAGE,
  })
  @MaxLength(COMPANY_DESCRIPTION_MAX_LENGTH, {
    message: COMPANY_DESCRIPTION_MAX_LENGTH_MESSAGE,
  })
  description: string;

  @IsDefined({ message: COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE })
  @Validate(IsCountryCodeValid, {
    message: COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE,
  })
  country: string;

  @IsDefined({ message: COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE })
  @IsUrl(
    { protocols: [`http`, `https`] },
    { message: COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE },
  )
  website: string;

  @IsOptional()
  @IsNotEmpty({ message: COMPANY_LINKEDIN_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMPANY_LINKEDIN_IS_NOT_VALID_MESSAGE })
  @IsUrl(
    {
      protocols: [`http`, `https`],
      host_whitelist: [`www.linkedin.com`, `linkedin.com`],
    },
    { message: COMPANY_LINKEDIN_IS_NOT_VALID_MESSAGE },
  )
  linkedin: string;

  @IsDefined({ message: COMPANY_SPONSORSHIP_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMPANY_SPONSORSHIP_IS_NOT_VALID_MESSAGE })
  @IsEnum(SponsorshipSupport, {
    message: COMPANY_SPONSORSHIP_IS_NOT_VALID_MESSAGE,
  })
  supportsSponsorshipProgram: SponsorshipSupport;
}

export class CreateCompanyResponseDto extends CoreResponseDto {}
