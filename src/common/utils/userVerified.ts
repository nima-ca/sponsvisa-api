import { User } from "@prisma/client";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { ForbiddenException } from "@nestjs/common";

export const checkIfUserIsVerified = (
  user: User,
  i18n: I18nContext<I18nTranslations>,
): void => {
  const USER_NOT_VERIFIED_EXCEPTION_MESSAGE = i18n.t(
    `common.errors.userNotVerifiedException`,
  );

  if (!user.isVerified) {
    throw new ForbiddenException(USER_NOT_VERIFIED_EXCEPTION_MESSAGE);
  }
};
