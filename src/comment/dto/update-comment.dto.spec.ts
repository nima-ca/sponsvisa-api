import { validateSync } from "class-validator";
import { UpdateCommentDto } from "./update-comment.dto";
import { ValidationError } from "@nestjs/common";
import { stringGenerator } from "src/common/utils/generator.utils";
import { COMMENT_MESSAGE_MAX_LENGTH } from "../constants/comment.constants";

describe(`UpdateCommentDto`, () => {
  it(`should validate correctly when all fields are valid`, () => {
    const dto = new UpdateCommentDto();
    dto.message = `Valid message`;
    dto.isApproved = true;

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it(`should fail validation when message is not a string`, () => {
    const dto = new UpdateCommentDto();
    dto.message = 123 as unknown as string;

    const errors = validateSync(dto);
    expect(errors.length).toBe(1);

    const validationError = errors[0] as ValidationError;
    expect(validationError.property).toBe(`message`);
    expect(validationError.constraints).toHaveProperty(`isString`);
  });

  it(`should fail validation when message is not provided`, () => {
    const dto = new UpdateCommentDto();
    dto.message = ``;

    const errors = validateSync(dto);
    expect(errors.length).toBe(1);

    const validationError = errors[0] as ValidationError;
    expect(validationError.property).toBe(`message`);
    expect(validationError.constraints).toHaveProperty(`isNotEmpty`);
  });

  it(`should fail validation when message exceeds max length`, () => {
    const dto = new UpdateCommentDto();
    dto.message = `${stringGenerator(COMMENT_MESSAGE_MAX_LENGTH + 1, `a`)}`;

    const errors = validateSync(dto);
    expect(errors.length).toBe(1);

    const validationError = errors[0] as ValidationError;
    expect(validationError.property).toBe(`message`);
    expect(validationError.constraints).toHaveProperty(`maxLength`);
  });

  it(`should validate correctly when isApproved is not provided`, () => {
    const dto = new UpdateCommentDto();

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it(`should fail validation when isApproved is not a boolean`, () => {
    const dto = new UpdateCommentDto();
    dto.isApproved = `true` as unknown as boolean;

    const errors = validateSync(dto);
    expect(errors.length).toBe(1);

    const validationError = errors[0] as ValidationError;
    expect(validationError.property).toBe(`isApproved`);
    expect(validationError.constraints).toHaveProperty(`isBoolean`);
  });
});
