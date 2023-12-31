import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

// Name constants
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const NAME_MIN_LENGTH_MESSAGE = i18nValidationMessage<I18nTranslations>(
  `auth.constants.name.minLengthError`,
);
export const NAME_MAX_LENGTH_MESSAGE = i18nValidationMessage<I18nTranslations>(
  `auth.constants.name.maxLengthError`,
);
export const NAME_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(`auth.constants.name.notValidError`);

// Password constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;

export const PASSWORD_MIN_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.password.minLengthError`,
    { length: PASSWORD_MIN_LENGTH },
  );

export const PASSWORD_MAX_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.password.maxLengthError`,
    { length: PASSWORD_MAX_LENGTH },
  );

export const PASSWORD_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.password.notValidError`,
  );

export const PASSWORD_IS_NOT_STRONG_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.password.notStrongEnoughError`,
  );

// confirm password
export const CONFIRM_PASSWORD_MIN_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.confirmPassword.minLengthError`,
    { length: PASSWORD_MIN_LENGTH },
  );

export const CONFIRM_PASSWORD_MAX_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.confirmPassword.maxLengthError`,
    { length: PASSWORD_MAX_LENGTH },
  );

export const CONFIRM_PASSWORD_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.confirmPassword.notValidError`,
  );

export const CONFIRM_PASSWORD_DO_NOT_MATCH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.confirmPassword.doNotMatchError`,
  );

// email constants
export const EMAIL_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(`auth.constants.email.notValidError`);

// refresh token
export const REFRESH_TOKEN_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `auth.constants.refreshToken.notValidError`,
  );

// auth
export const AUTH_USER_KEY_IN_REQUEST = `AUTH_USER`;
export const VERIFICATION_CODE_SEED = `1234567890`;
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES = 2;

export const ACCESS_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};

export const REFRESH_TOKEN_COOKIE_CONFIG = {
  ...ACCESS_TOKEN_COOKIE_CONFIG,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

export const ACCESS_TOKEN_KEY_IN_COOKIE = `accessToken`;
export const REFRESH_TOKEN_KEY_IN_COOKIE = `refreshToken`;
