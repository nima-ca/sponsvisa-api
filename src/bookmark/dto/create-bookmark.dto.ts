import { IsDefined, IsInt, IsPositive } from "class-validator";
import { COMPANY_ID_IS_NOT_VALID_MESSAGE } from "../bookmark.constants";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class CreateBookmarkDto {
  @IsInt({ message: COMPANY_ID_IS_NOT_VALID_MESSAGE })
  @IsDefined({ message: COMPANY_ID_IS_NOT_VALID_MESSAGE })
  @IsPositive({ message: COMPANY_ID_IS_NOT_VALID_MESSAGE })
  companyId: number;
}

export class CreateBookmarkResponseDto extends CoreResponseDto {}
