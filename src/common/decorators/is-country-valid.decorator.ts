import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isValid as isCountryCodeValid } from "i18n-iso-countries";

@ValidatorConstraint({ name: `isCountryValid`, async: false })
export class IsCountryCodeValid implements ValidatorConstraintInterface {
  validate(countryCode: string) {
    return isCountryCodeValid(countryCode);
  }

  defaultMessage() {
    return `Invalid Country Code`;
  }
}
