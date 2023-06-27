import { Controller, Get } from "@nestjs/common";
import { ListService } from "./list.service";
import { ApiTags } from "@nestjs/swagger";
import { I18n, I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { GetCountriesResponseDto } from "./dto/get-country.dto";

@ApiTags(`list`)
@Controller({
  path: `list`,
  version: `1`,
})
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(`country`)
  countries(
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): GetCountriesResponseDto {
    return this.listService.getCountries(i18n);
  }
}
