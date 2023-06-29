import { validate } from "class-validator";
import { VerifyCodeDto } from "./verification.dto";
import { stringGenerator } from "src/common/utils/generator.utils";
import { VERIFICATION_CODE_LENGTH } from "../constants/auth.constants";

describe(`VerifyCodeDto`, () => {
  it(`should validate the code property`, async () => {
    const dto = new VerifyCodeDto();
    dto.code = stringGenerator(VERIFICATION_CODE_LENGTH, `a`);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it(`should throw an error if the code property is empty`, async () => {
    const dto = new VerifyCodeDto();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(`isNotEmpty`);
  });

  it(`should throw an error if the code property length is invalid`, async () => {
    const dto = new VerifyCodeDto();
    dto.code = stringGenerator(VERIFICATION_CODE_LENGTH + 1, `a`);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(`isLength`);
  });
});
