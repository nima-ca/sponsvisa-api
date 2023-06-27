import { VoteStatus } from "@prisma/client";
import { IsDefined, IsEnum, IsInt } from "class-validator";
import {
  VOTE_COMMENT_ID_IS_NOT_VALID_MESSAGE,
  VOTE_STATUS_IS_NOT_VALID_MESSAGE,
} from "../constants/vote.constants";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class CreateVoteDto {
  @IsDefined({ message: VOTE_COMMENT_ID_IS_NOT_VALID_MESSAGE })
  @IsInt({ message: VOTE_COMMENT_ID_IS_NOT_VALID_MESSAGE })
  commentId: number;

  @IsDefined({ message: VOTE_STATUS_IS_NOT_VALID_MESSAGE })
  @IsEnum(VoteStatus, { message: VOTE_STATUS_IS_NOT_VALID_MESSAGE })
  status: VoteStatus;
}

export class CreateVoteResponseDto extends CoreResponseDto {}
