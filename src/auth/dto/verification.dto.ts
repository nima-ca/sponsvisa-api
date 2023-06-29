import { IsNotEmpty, IsString, Length } from "class-validator";
import { VERIFICATION_CODE_LENGTH } from "../constants/auth.constants";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(VERIFICATION_CODE_LENGTH, VERIFICATION_CODE_LENGTH)
  code: string;
}

export class VerifyCodeResponseDto extends CoreResponseDto {}

export class SendVerificationCodeResponseDto extends CoreResponseDto {}
