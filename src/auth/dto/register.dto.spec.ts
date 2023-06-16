import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { stringGenerator } from "src/common/utils/generator.utils";
import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../constants/auth.constants";
import { RegisterDto } from "./register.dto";

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
          isDefined: expect.any(String),
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
          isNotEmpty: expect.any(String),
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
          isString: expect.any(String),
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
          minLength: expect.any(String),
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
          maxLength: expect.any(String),
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
          isDefined: expect.any(String),
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
          isNotEmpty: expect.any(String),
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
          isEmail: expect.any(String),
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

  describe(`Password`, () => {
    it(`should fail if password is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is empty`, async () => {
      const mockObject = { password: `` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is less than the expected characters`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          minLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is more than the expected characters`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is not complex`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          matches: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if password is correct`, async () => {
      // create complex password
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH - 3, `a`) + `C0@`,
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(passwordErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Confirm Password`, () => {
    it(`should fail if confirm password is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(confirmPasswordErrors).toBeDefined();
      expect(confirmPasswordErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if confirm password is empty`, async () => {
      const mockObject = { confirmPassword: `` };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(confirmPasswordErrors).toBeDefined();
      expect(confirmPasswordErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if confirm password is less than the expected characters`, async () => {
      const mockObject = {
        confirmPassword: stringGenerator(PASSWORD_MIN_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(confirmPasswordErrors).toBeDefined();
      expect(confirmPasswordErrors.constraints).toEqual(
        expect.objectContaining({
          minLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if confirm password is more than the expected characters`, async () => {
      const mockObject = {
        confirmPassword: stringGenerator(PASSWORD_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(confirmPasswordErrors).toBeDefined();
      expect(confirmPasswordErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if confirm password is not the same as password`, async () => {
      const PASSWORD = stringGenerator(PASSWORD_MIN_LENGTH + 1, `a`); // use letter 'a' as seed
      const CONFIRM_PASSWORD = stringGenerator(PASSWORD_MIN_LENGTH + 1, `b`); // use letter 'b' as seed
      const mockObject = {
        password: PASSWORD,
        confirmPassword: CONFIRM_PASSWORD,
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(confirmPasswordErrors).toBeDefined();
      expect(confirmPasswordErrors.constraints).toEqual(
        expect.objectContaining({
          Match: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if confirm password is correct`, async () => {
      // create complex password
      const PASSWORD = stringGenerator(PASSWORD_MIN_LENGTH - 3, `a`) + `C0@`;
      const mockObject = {
        password: PASSWORD,
        confirmPassword: PASSWORD,
      };
      const mockedInstance = plainToInstance(RegisterDto, mockObject);

      const errors = await validate(mockedInstance);
      const confirmPasswordErrors = errors.filter(
        (err) => err.property === `confirmPassword`,
      )[0];

      expect(confirmPasswordErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });
});
