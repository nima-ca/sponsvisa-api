import { IsNotEmpty, IsString } from "class-validator";
import { LoginResponseDto } from "./login.dto";
import { REFRESH_TOKEN_IS_NOT_VALID_MESSAGE } from "../constants/auth.constants";

export class ValidateRefreshTokenDto {
  @IsNotEmpty({ message: REFRESH_TOKEN_IS_NOT_VALID_MESSAGE })
  @IsString({ message: REFRESH_TOKEN_IS_NOT_VALID_MESSAGE })
  refreshToken: string;
}

export class ValidateRefreshTokenResponseDto extends LoginResponseDto {}
