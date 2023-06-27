import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateVoteDto, CreateVoteResponseDto } from "./dto/create-vote.dto";
import { VoteService } from "./vote.service";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { User } from "@prisma/client";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { I18n, I18nContext } from "nestjs-i18n";
import { ApiTags } from "@nestjs/swagger";
import { setRole } from "src/common/decorators/setRole.decorator";

@ApiTags(`vote`)
@Controller({
  path: `vote`,
  version: `1`,
})
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @setRole([`ANY`])
  create(
    @Body() createVoteDto: CreateVoteDto,
    @AuthUser() user: User,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ): Promise<CreateVoteResponseDto> {
    return this.voteService.createOrUpdate(createVoteDto, user, i18n);
  }

  @Delete(`:id`)
  @setRole([`ANY`])
  remove(@Param(`id`) id: string) {
    return this.voteService.remove(+id);
  }
}
