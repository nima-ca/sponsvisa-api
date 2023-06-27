import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateCommentDto } from "./create-comment.dto";
import { stringGenerator } from "src/common/utils/generator.utils";
import { COMMENT_MESSAGE_MAX_LENGTH } from "../constants/comment.constants";

describe(`Create Comment DTO`, () => {
  describe(`Message`, () => {
    it(`should fail if message is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const messageErrors = errors.filter(
        (err) => err.property === `message`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(messageErrors).toBeDefined();
      expect(messageErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if message is empty`, async () => {
      const mockObject = {
        message: ``,
      };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const messageErrors = errors.filter(
        (err) => err.property === `message`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(messageErrors).toBeDefined();
      expect(messageErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if message is not string`, async () => {
      const mockObject = {
        message: 123,
      };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const messageErrors = errors.filter(
        (err) => err.property === `message`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(messageErrors).toBeDefined();
      expect(messageErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if message is larger than expected characters`, async () => {
      // create a message with more character than expected
      const mockObject = {
        message: stringGenerator(COMMENT_MESSAGE_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const messageErrors = errors.filter(
        (err) => err.property === `message`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(messageErrors).toBeDefined();
      expect(messageErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the message is correct`, async () => {
      // create a message with correct length
      const mockObject = {
        message: stringGenerator(COMMENT_MESSAGE_MAX_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const messageErrors = errors.filter(
        (err) => err.property === `message`,
      )[0];

      expect(messageErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Company Id`, () => {
    it(`should fail if companyId is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const companyIdErrors = errors.filter(
        (err) => err.property === `companyId`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(companyIdErrors).toBeDefined();
      expect(companyIdErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if companyId is not Integer`, async () => {
      const mockObject = {
        companyId: `123`,
      };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const companyIdErrors = errors.filter(
        (err) => err.property === `companyId`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(companyIdErrors).toBeDefined();
      expect(companyIdErrors.constraints).toEqual(
        expect.objectContaining({
          isInt: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the companyId is correct`, async () => {
      // create a companyId with correct format
      const mockObject = { companyId: 1 };
      const mockedInstance = plainToInstance(CreateCommentDto, mockObject);

      const errors = await validate(mockedInstance);
      const companyIdErrors = errors.filter(
        (err) => err.property === `companyId`,
      )[0];

      expect(companyIdErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });
});
