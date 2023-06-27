import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, Max } from "class-validator";
import {
  PAGINATION_MAX_LIMIT_DTO,
  PAGINATION_MAX_LIMIT_MESSAGE_DTO,
  QUERY_SEARCH_IS_STRING_MESSAGE_DTO,
  getIsIntegerErrorMessage,
  getIsPositiveErrorMessage,
} from "../constants/dto";

const PAGINATION_DEFAULT_PAGE = 1;
const PAGINATION_DEFAULT_LIMIT = 10;

export class CoreResponseDto {
  success: boolean;
  error: string[] | null;
}

export interface ICoreFindAllResponseDto<T = unknown> extends CoreResponseDto {
  items: T[];
  totalCount: number;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: getIsPositiveErrorMessage(`page`) })
  @IsInt({ message: getIsIntegerErrorMessage(`page`) })
  page?: number = PAGINATION_DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: getIsPositiveErrorMessage(`limit`) })
  @IsInt({ message: getIsIntegerErrorMessage(`limit`) })
  @Max(PAGINATION_MAX_LIMIT_DTO, {
    message: PAGINATION_MAX_LIMIT_MESSAGE_DTO,
  })
  limit?: number = PAGINATION_DEFAULT_LIMIT;
}

export class PaginationQueryWithSearchDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: QUERY_SEARCH_IS_STRING_MESSAGE_DTO })
  searchQuery?: string;
}

export class SearchQueryDto {
  @IsOptional()
  @IsString({ message: QUERY_SEARCH_IS_STRING_MESSAGE_DTO })
  searchQuery?: string;
}
