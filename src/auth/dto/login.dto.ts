import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { CoreResponseDto } from "src/common/dto/common.dto";
import {
  EMAIL_IS_NOT_VALID_MESSAGE,
  PASSWORD_IS_NOT_STRONG_MESSAGE,
  PASSWORD_IS_NOT_VALID_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
} from "../constants/register.constants";
import { PASSWORD_REGEX } from "src/common/constants/regex.const";

export class LoginDto {
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
}

export class LoginResponseDto extends CoreResponseDto {
  token: string | null;
}
