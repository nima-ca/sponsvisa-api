import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { CoreResponseDto } from "src/common/dto/common.dto";
import {
  COMMENT_COMPANY_ID_IS_NOT_VALID_MESSAGE,
  COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE,
  COMMENT_MESSAGE_MAX_LENGTH,
} from "../constants/comment.constants";
export class CreateCommentDto {
  @IsDefined({ message: COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE })
  @IsNotEmpty({ message: COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE })
  @MaxLength(COMMENT_MESSAGE_MAX_LENGTH)
  message: string;

  @IsDefined({ message: COMMENT_COMPANY_ID_IS_NOT_VALID_MESSAGE })
  @IsInt({ message: COMMENT_COMPANY_ID_IS_NOT_VALID_MESSAGE })
  companyId: number;
}

export class CreateCommentResponseDto extends CoreResponseDto {}
