import { validate } from "class-validator";
import { CreateBookmarkDto } from "./create-bookmark.dto";

describe(`CreateBookmarkDto`, () => {
  it(`should pass validation when companyId is a positive integer`, async () => {
    const dto = new CreateBookmarkDto();
    dto.companyId = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it(`should fail validation when companyId is not defined`, async () => {
    const dto = new CreateBookmarkDto();

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(`isDefined`);
  });

  it(`should fail validation when companyId is not a positive integer`, async () => {
    const dto = new CreateBookmarkDto();
    dto.companyId = -1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty(`isPositive`);
  });
});
