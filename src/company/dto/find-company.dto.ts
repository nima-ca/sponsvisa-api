import { Company } from "@prisma/client";
import { CoreResponseDto } from "src/common/dto/common.dto";

export class FindOneCompanyResponseDto extends CoreResponseDto {
  company:
    | (Company & {
        countryName: string;
      })
    | null;
}
