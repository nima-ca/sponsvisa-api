import { validate } from "class-validator";
import {
  PaginationQueryDto,
  PaginationQueryWithSearchDto,
  SearchQueryDto,
} from "./common.dto";

describe(`Common DTOs`, () => {
  describe(`PaginationQueryDto`, () => {
    let dto: PaginationQueryDto;

    beforeEach(() => {
      dto = new PaginationQueryDto();
    });

    it(`should be defined`, () => {
      expect(dto).toBeDefined();
      expect.hasAssertions();
    });

    it(`should not validate page and limit if they are not provided`, async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect.hasAssertions();
    });

    it(`should validate page and limit as positive integers`, async () => {
      dto.page = 1;
      dto.limit = 10;

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect.hasAssertions();
    });

    it(`should fail if page is not positive integer`, async () => {
      dto.page = -1;

      const errors = await validate(dto);

      const pageErrors = errors.filter((err) => err.property === `page`)[0];
      expect(pageErrors.constraints).toEqual(
        expect.objectContaining({
          isPositive: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if limit is not positive integer`, async () => {
      dto.limit = -1;

      const errors = await validate(dto);

      const limitErrors = errors.filter((err) => err.property === `limit`)[0];
      expect(limitErrors.constraints).toEqual(
        expect.objectContaining({
          isPositive: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if page is not integer`, async () => {
      dto.page = 1.5;

      const errors = await validate(dto);

      const pageErrors = errors.filter((err) => err.property === `page`)[0];
      expect(pageErrors.constraints).toEqual(
        expect.objectContaining({
          isInt: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if limit is not integer`, async () => {
      dto.limit = 1.5;

      const errors = await validate(dto);

      const limitErrors = errors.filter((err) => err.property === `limit`)[0];
      expect(limitErrors.constraints).toEqual(
        expect.objectContaining({
          isInt: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });
  });

  describe(`PaginationQueryWithSearchDto`, () => {
    let dto: PaginationQueryWithSearchDto;

    beforeEach(() => {
      dto = new PaginationQueryWithSearchDto();
    });

    it(`should validate page, limit, and searchQuery`, async () => {
      dto.page = 1;
      dto.limit = 10;
      dto.searchQuery = `Test`;

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it(`should fail if the search query is not string`, async () => {
      dto.page = 1;
      dto.limit = 10;
      dto.searchQuery = 5 as unknown as string;

      const errors = await validate(dto);
      const searchQueryErrors = errors.filter(
        (err) => err.property === `searchQuery`,
      )[0];

      expect(searchQueryErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });
  });

  describe(`SearchQueryDto`, () => {
    let dto: SearchQueryDto;

    beforeEach(() => {
      dto = new SearchQueryDto();
    });

    it(`should validate page, limit, and searchQuery`, async () => {
      dto.searchQuery = `Test`;

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it(`should fail if the search query is not string`, async () => {
      dto.searchQuery = 5 as unknown as string;

      const errors = await validate(dto);
      const searchQueryErrors = errors.filter(
        (err) => err.property === `searchQuery`,
      )[0];

      expect(searchQueryErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });
  });
});
