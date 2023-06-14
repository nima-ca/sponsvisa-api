import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { PASSWORD_REGEX } from "src/common/constants/regex.const";
import { Match } from "src/common/decorators/match.decorator";
import {
  EMAIL_NOT_VALID_MESSAGE,
  NAME_IS_STRING_MESSAGE,
  NAME_MAX_LENGTH,
  NAME_MAX_LENGTH_MESSAGE,
  NAME_MIN_LENGTH,
  NAME_MIN_LENGTH_MESSAGE,
  PASSWORD_IS_STRING_MESSAGE,
  PASSWORD_IS_VALID_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
} from "../constants/register.constants";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class RegisterDto {
  @IsString({ message: NAME_IS_STRING_MESSAGE })
  @MinLength(NAME_MIN_LENGTH, { message: NAME_MIN_LENGTH_MESSAGE })
  @MaxLength(NAME_MAX_LENGTH, { message: NAME_MAX_LENGTH_MESSAGE })
  name: string;

  @IsString({ message: EMAIL_NOT_VALID_MESSAGE })
  @IsEmail(undefined, { message: EMAIL_NOT_VALID_MESSAGE })
  email: string;

  @IsString({ message: PASSWORD_IS_STRING_MESSAGE })
  @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_MESSAGE })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_IS_VALID_MESSAGE })
  password: string;

  @IsString({ message: PASSWORD_IS_STRING_MESSAGE })
  @MinLength(PASSWORD_MIN_LENGTH, { message: PASSWORD_MIN_LENGTH_MESSAGE })
  @MaxLength(PASSWORD_MAX_LENGTH, { message: PASSWORD_MAX_LENGTH_MESSAGE })
  @Match(`password`) // Check if confirm password matches the password
  confirmPassword: string;
}

export class RegisterResponseDto extends CoreResponseDto {}
