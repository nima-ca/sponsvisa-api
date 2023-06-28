import { validateSync } from "class-validator";
import { ValidateRefreshTokenDto } from "./refreshToken.dto";

describe(`RefreshTokenDto`, () => {
  describe(`ValidateRefreshTokenDto`, () => {
    it(`should validate a valid DTO`, () => {
      const dto = new ValidateRefreshTokenDto();
      dto.refreshToken = `valid-refresh-token`;

      const errors = validateSync(dto);

      expect(errors.length).toBe(0);
    });

    it(`should fail validation when refreshToken is empty`, () => {
      const dto = new ValidateRefreshTokenDto();
      dto.refreshToken = ``;

      const errors = validateSync(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(`isNotEmpty`);
    });

    it(`should fail validation when refreshToken is not a string`, () => {
      const dto = new ValidateRefreshTokenDto();
      dto.refreshToken = 123 as any; // Assigning a number instead of a string

      const errors = validateSync(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty(`isString`);
    });
  });
});
