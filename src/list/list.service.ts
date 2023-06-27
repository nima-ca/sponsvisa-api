import { Injectable } from "@nestjs/common";
import { getNames } from "i18n-iso-countries";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { GetCountriesResponseDto } from "./dto/get-country.dto";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";

@Injectable()
export class ListService {
  getCountries(i18n: I18nContext<I18nTranslations>): GetCountriesResponseDto {
    return {
      ...CORE_SUCCESS_DTO,
      countries: getNames(i18n.lang),
    };
  }
}
