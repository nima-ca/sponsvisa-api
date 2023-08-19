import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

export const CORE_SUCCESS_DTO = { success: true, errors: null };

export const PAGINATION_MIN_PAGE_DTO = 1;
export const PAGINATION_MIN_LIMIT_DTO = 1;
export const PAGINATION_MAX_LIMIT_DTO = 100;

export const getIsIntegerErrorMessage = (field: string) =>
  i18nValidationMessage<I18nTranslations>(`common.constants.isInteger`, {
    field,
  });

export const getIsPositiveErrorMessage = (field: string) =>
  i18nValidationMessage<I18nTranslations>(`common.constants.isPositive`, {
    field,
  });

export const PAGINATION_MAX_LIMIT_MESSAGE_DTO =
  i18nValidationMessage<I18nTranslations>(`common.constants.limitMaxNumber`, {
    max: PAGINATION_MAX_LIMIT_DTO,
  });

export const QUERY_SEARCH_IS_STRING_MESSAGE_DTO =
  i18nValidationMessage<I18nTranslations>(
    `common.constants.searchQueryIsString`,
    {
      max: PAGINATION_MIN_PAGE_DTO,
    },
  );
