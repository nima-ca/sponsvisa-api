import { Injectable } from "@nestjs/common";
import { CreateVoteDto } from "./dto/create-vote.dto";

@Injectable()
export class VoteService {
  create(createVoteDto: CreateVoteDto) {
    return `This action adds a new vote`;
  }

  remove(id: number) {
    return `This action removes a #${id} vote`;
  }
}
