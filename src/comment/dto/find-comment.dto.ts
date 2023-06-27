import { UserRole, VoteStatus } from "@prisma/client";
import { CoreResponseDto, PaginationQueryDto } from "src/common/dto/common.dto";

export class FindAllCommentsQueryDto extends PaginationQueryDto {}

type CommentUser = {
  id: number;
  name: string;
  role: UserRole;
};

export type FindAllComment = {
  id: number;
  message: string;
  author: CommentUser;
  createdAt: Date;
  companyId: number;
  upVotes: number;
  downVotes: number;
  userVote: VoteStatus | undefined;
};

export class FindAllCommentsResponseDto extends CoreResponseDto {
  comments: FindAllComment[];
  totalCount: number;
}
