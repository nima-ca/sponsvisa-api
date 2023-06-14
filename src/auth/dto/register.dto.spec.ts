import { plainToInstance } from "class-transformer";
import { RegisterDto } from "./register.dto";
import { validate } from "class-validator";
import {
  EMAIL_IS_NOT_VALID_MESSAGE,
  NAME_IS_NOT_VALID_MESSAGE,
  NAME_MAX_LENGTH,
  NAME_MAX_LENGTH_MESSAGE,
  NAME_MIN_LENGTH,
  NAME_MIN_LENGTH_MESSAGE,
} from "../constants/register.constants";
import { stringGenerator } from "src/common/utils/generator.utils";

describe(`Register DTO`, () => {
  describe(`Name`, () => {
    it(`should fail if name is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(errors.length).not.toBe(0);
      expect(nameErrors).toBeDefined();
      expect(nameErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: NAME_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if name is empty`, async () => {
      const mockObject = { name: `` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(errors.length).not.toBe(0);
      expect(nameErrors).toBeDefined();
      expect(nameErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: NAME_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if name is not string`, async () => {
      const mockObject = { name: 0 };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(errors.length).not.toBe(0);
      expect(nameErrors).toBeDefined();
      expect(nameErrors.constraints).toEqual(
        expect.objectContaining({
          isString: NAME_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if name is less than expected characters`, async () => {
      // create a name with less character than expected
      const mockObject = { name: stringGenerator(NAME_MIN_LENGTH - 1, `a`) };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(errors.length).not.toBe(0);
      expect(nameErrors).toBeDefined();
      expect(nameErrors.constraints).toEqual(
        expect.objectContaining({
          minLength: NAME_MIN_LENGTH_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if name is larger than expected characters`, async () => {
      // create a name with more character than expected
      const mockObject = { name: stringGenerator(NAME_MAX_LENGTH + 1, `a`) };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(errors.length).not.toBe(0);
      expect(nameErrors).toBeDefined();
      expect(nameErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: NAME_MAX_LENGTH_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the name is correct`, async () => {
      // create a name with correct length
      const mockObject = { name: stringGenerator(NAME_MIN_LENGTH + 1, `a`) };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(nameErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Email`, () => {
    it(`should fail if email is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const emailErrors = errors.filter((err) => err.property === `email`)[0];

      expect(errors.length).not.toBe(0);
      expect(emailErrors).toBeDefined();
      expect(emailErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: EMAIL_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if email is empty`, async () => {
      const mockObject = { email: `` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const emailErrors = errors.filter((err) => err.property === `email`)[0];

      expect(errors.length).not.toBe(0);
      expect(emailErrors).toBeDefined();
      expect(emailErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: EMAIL_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if email is not correct`, async () => {
      const mockObject = { email: `some text other than email` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const emailErrors = errors.filter((err) => err.property === `email`)[0];

      expect(errors.length).not.toBe(0);
      expect(emailErrors).toBeDefined();
      expect(emailErrors.constraints).toEqual(
        expect.objectContaining({
          isEmail: EMAIL_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the email is correct`, async () => {
      const mockObject = { email: `test@test.com` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const emailErrors = errors.filter((err) => err.property === `email`)[0];
      expect(emailErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });
});
