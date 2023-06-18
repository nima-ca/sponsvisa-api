import { i18nValidationMessage } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

// Company Name
export const COMPANY_NAME_MAX_LENGTH = 150;

export const COMPANY_NAME_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.name.notValidError`,
  );

export const COMPANY_NAME_MAX_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.name.maxLengthError`,
    { length: COMPANY_NAME_MAX_LENGTH },
  );

// Company Description
export const COMPANY_DESCRIPTION_MIN_LENGTH = 50;
export const COMPANY_DESCRIPTION_MAX_LENGTH = 2000;

export const COMPANY_DESCRIPTION_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.description.notValidError`,
  );

export const COMPANY_DESCRIPTION_MIN_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.description.minLengthError`,
    { length: COMPANY_DESCRIPTION_MIN_LENGTH },
  );

export const COMPANY_DESCRIPTION_MAX_LENGTH_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.description.maxLengthError`,
    { length: COMPANY_DESCRIPTION_MAX_LENGTH },
  );

// Company Country
export const COMPANY_COUNTRY_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.country.notValidError`,
  );

// Company Website
export const COMPANY_WEBSITE_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.website.notValidError`,
  );

// Company Linkedin
export const COMPANY_LINKEDIN_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.linkedin.notValidError`,
  );

// Company Linkedin
export const COMPANY_SPONSORSHIP_IS_NOT_VALID_MESSAGE =
  i18nValidationMessage<I18nTranslations>(
    `company.constants.supportsSponsorshipProgram.notValidError`,
  );
