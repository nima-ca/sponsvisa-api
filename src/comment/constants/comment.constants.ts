// DTO

import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

// message
export const COMMENT_MESSAGE_MAX_LENGTH = 2000;

export const COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `comment.constants.message.isNotValidError`,
  );
export const COMMENT_MESSAGE_MAX_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `comment.constants.message.maxLengthError`,
    {
      max: COMMENT_MESSAGE_MAX_LENGTH,
    },
  );

// parent id
export const COMMENT_PARENT_ID_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `comment.constants.parentId.isNotValidError`,
  );

// company id
export const COMMENT_COMPANY_ID_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `comment.constants.companyId.isNotValidError`,
  );
