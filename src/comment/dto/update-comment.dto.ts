import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { CoreResponseDto } from "src/common/dto/common.dto";
import {
  COMMENT_IS_APPROVED_IS_NOT_VALID_MESSAGE,
  COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE,
  COMMENT_MESSAGE_MAX_LENGTH,
} from "../constants/comment.constants";

export class UpdateCommentDto {
  @IsOptional()
  @IsNotEmpty({ message: COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE })
  @IsString({ message: COMMENT_MESSAGE_IS_NOT_VALID_MESSAGE })
  @MaxLength(COMMENT_MESSAGE_MAX_LENGTH)
  message?: string;

  @IsOptional()
  @IsBoolean({ message: COMMENT_IS_APPROVED_IS_NOT_VALID_MESSAGE })
  isApproved?: boolean;
}

export class UpdateCommentResponseDto extends CoreResponseDto {}
