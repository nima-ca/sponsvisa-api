import { Test, TestingModule } from "@nestjs/testing";
import { ListService } from "./list.service";
import { I18nContext } from "nestjs-i18n";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";
import { mockI18n } from "src/common/utils/generator.utils";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

describe(`ListService`, () => {
  let service: ListService;
  let i18n: I18nContext<I18nTranslations>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListService],
    }).compile();

    service = module.get<ListService>(ListService);
    i18n = mockI18n();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`Country`, () => {
    it(`should return the country response with names in the specified language`, () => {
      const result = service.getCountries(i18n);

      expect(result).toEqual({
        ...CORE_SUCCESS_DTO,
        countries: expect.any(Object),
      });
    });
  });
});
