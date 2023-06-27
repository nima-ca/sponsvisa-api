import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

export const VOTE_COMMENT_ID_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `vote.constants.commentId.notValidError`,
  );

export const VOTE_STATUS_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `vote.constants.status.notValidError`,
  );
