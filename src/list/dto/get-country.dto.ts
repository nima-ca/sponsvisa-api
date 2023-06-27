import { LocalizedCountryNames } from "i18n-iso-countries";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class GetCountriesResponseDto extends CoreResponseDto {
  countries: LocalizedCountryNames<{
    select: `official`;
  }>;
}
