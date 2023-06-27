import { PickType } from "@nestjs/swagger";
import { CoreResponseDto } from "src/common/dto/common.dto";
import { CreateCommentDto } from "./create-comment.dto";

export class UpdateCommentDto extends PickType(CreateCommentDto, [`message`]) {}

export class UpdateCommentResponseDto extends CoreResponseDto {}
