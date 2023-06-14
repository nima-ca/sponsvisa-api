import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { stringGenerator } from "src/common/utils/generator.utils";
import {
  EMAIL_IS_NOT_VALID_MESSAGE,
  PASSWORD_IS_NOT_STRONG_MESSAGE,
  PASSWORD_IS_NOT_VALID_MESSAGE,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
} from "../constants/auth.constants";
import { LoginDto } from "./login.dto";

describe(`Login DTO`, () => {
  describe(`Email`, () => {
    it(`should fail if email is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(LoginDto, mockObject);

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
      const mockedInstance = plainToInstance(LoginDto, mockObject);

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
      const mockedInstance = plainToInstance(LoginDto, mockObject);

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
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const emailErrors = errors.filter((err) => err.property === `email`)[0];
      expect(emailErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Password`, () => {
    it(`should fail if password is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: PASSWORD_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is empty`, async () => {
      const mockObject = { password: `` };
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: PASSWORD_IS_NOT_VALID_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is less than the expected characters`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          minLength: PASSWORD_MIN_LENGTH_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is more than the expected characters`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: PASSWORD_MAX_LENGTH_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if password is not complex`, async () => {
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors.constraints).toEqual(
        expect.objectContaining({
          matches: PASSWORD_IS_NOT_STRONG_MESSAGE,
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if password is correct`, async () => {
      // create complex password
      const mockObject = {
        password: stringGenerator(PASSWORD_MIN_LENGTH - 3, `a`) + `C0@`,
      };
      const mockedInstance = plainToInstance(LoginDto, mockObject);

      const errors = await validate(mockedInstance);
      const passwordErrors = errors.filter(
        (err) => err.property === `password`,
      )[0];

      expect(passwordErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });
});
