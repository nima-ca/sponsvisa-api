import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { PASSWORD_REGEX } from "src/common/constants/regex.const";
import { Match } from "src/common/decorators/match.decorator";
import {
  EMAIL_IS_NOT_VALID_MESSAGE,
  NAME_IS_NOT_VALID_MESSAGE,
  NAME_MAX_LENGTH,
  NAME_MAX_LENGTH_MESSAGE,
  NAME_MIN_LENGTH,
  NAME_MIN_LENGTH_MESSAGE,
  PASSWORD_IS_NOT_VALID_MESSAGE,
  PASSWORD_IS_NOT_STRONG_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  CONFIRM_PASSWORD_DO_NOT_MATCH_MESSAGE,
  CONFIRM_PASSWORD_IS_NOT_VALID_MESSAGE,
  CONFIRM_PASSWORD_MIN_LENGTH_MESSAGE,
  CONFIRM_PASSWORD_MAX_LENGTH_MESSAGE,
} from "../constants/auth.constants";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class RegisterDto {
  @IsDefined({ message: NAME_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: NAME_IS_NOT_VALID_MESSAGE })
  @IsString({ message: NAME_IS_NOT_VALID_MESSAGE })
  @MinLength(NAME_MIN_LENGTH, { message: NAME_MIN_LENGTH_MESSAGE })
  @MaxLength(NAME_MAX_LENGTH, { message: NAME_MAX_LENGTH_MESSAGE })
  name: string;

  @IsDefined({ message: EMAIL_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: EMAIL_IS_NOT_VALID_MESSAGE })
  @IsString({ message: EMAIL_IS_NOT_VALID_MESSAGE })
  @IsEmail(undefined, { message: EMAIL_IS_NOT_VALID_MESSAGE })
  email: string;

  @IsDefined({ message: PASSWORD_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: PASSWORD_IS_NOT_VALID_MESSAGE })
  @IsString({ message: PASSWORD_IS_NOT_VALID_MESSAGE })
  @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_MESSAGE })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_IS_NOT_STRONG_MESSAGE })
  password: string;

  @IsDefined({ message: CONFIRM_PASSWORD_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: CONFIRM_PASSWORD_IS_NOT_VALID_MESSAGE })
  @IsString({ message: CONFIRM_PASSWORD_IS_NOT_VALID_MESSAGE })
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: CONFIRM_PASSWORD_MIN_LENGTH_MESSAGE,
  })
  @MaxLength(PASSWORD_MAX_LENGTH, {
    message: CONFIRM_PASSWORD_MAX_LENGTH_MESSAGE,
  })
  @Match(`password`, { message: CONFIRM_PASSWORD_DO_NOT_MATCH_MESSAGE }) // Check if confirm password matches the password
  confirmPassword: string;
}

export class RegisterResponseDto extends CoreResponseDto {}
