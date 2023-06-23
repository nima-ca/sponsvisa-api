import { plainToInstance } from "class-transformer";
import { UpdateCompanyDto } from "./update-company.dto";
import { validate } from "class-validator";

describe(`Update Company DTO`, () => {
  describe(`isApproved`, () => {
    it(`should fail if isApproved is not boolean`, async () => {
      const mockObject = { isApproved: `non-boolean` };
      const mockedInstance = plainToInstance(UpdateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const isApprovedErrors = errors.filter(
        (err) => err.property === `isApproved`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(isApprovedErrors).toBeDefined();
      expect(isApprovedErrors.constraints).toEqual(
        expect.objectContaining({
          isBoolean: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });
  });
});
