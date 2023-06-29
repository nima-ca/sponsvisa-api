import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

export const COMPANY_ID_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `bookmark.constants.companyId.isNotValidError`,
  );
