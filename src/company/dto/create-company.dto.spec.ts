import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateCompanyDto } from "./create-company.dto";
import { stringGenerator } from "src/common/utils/generator.utils";
import {
  COMPANY_DESCRIPTION_MAX_LENGTH,
  COMPANY_DESCRIPTION_MIN_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
} from "../constants/company.constants";
import { SponsorshipSupport } from "@prisma/client";

describe(`Create Company DTO`, () => {
  describe(`Name`, () => {
    it(`should fail if name is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

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
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

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
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

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

    it(`should fail if name is larger than expected characters`, async () => {
      // create a name with more character than expected
      const mockObject = {
        name: stringGenerator(COMPANY_NAME_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

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
      const mockObject = {
        name: stringGenerator(COMPANY_NAME_MAX_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const nameErrors = errors.filter((err) => err.property === `name`)[0];

      expect(nameErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Description`, () => {
    it(`should fail if description is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(descriptionErrors).toBeDefined();
      expect(descriptionErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if description is empty`, async () => {
      const mockObject = { description: `` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(descriptionErrors).toBeDefined();
      expect(descriptionErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if description is not string`, async () => {
      const mockObject = { description: 0 };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(descriptionErrors).toBeDefined();
      expect(descriptionErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if description is less than the expected characters`, async () => {
      const mockObject = {
        description: stringGenerator(COMPANY_DESCRIPTION_MIN_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(descriptionErrors).toBeDefined();
      expect(descriptionErrors.constraints).toEqual(
        expect.objectContaining({
          minLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if description is larger than expected characters`, async () => {
      // create a description with more character than expected
      const mockObject = {
        description: stringGenerator(COMPANY_DESCRIPTION_MAX_LENGTH + 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(descriptionErrors).toBeDefined();
      expect(descriptionErrors.constraints).toEqual(
        expect.objectContaining({
          maxLength: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the description is correct`, async () => {
      // create a description with correct length
      const mockObject = {
        description: stringGenerator(COMPANY_NAME_MAX_LENGTH - 1, `a`),
      };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const descriptionErrors = errors.filter(
        (err) => err.property === `description`,
      )[0];

      expect(descriptionErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Country`, () => {
    it(`should fail if country is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const countryErrors = errors.filter(
        (err) => err.property === `country`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(countryErrors).toBeDefined();
      expect(countryErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if country is empty`, async () => {
      const mockObject = { country: `` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const countryErrors = errors.filter(
        (err) => err.property === `country`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(countryErrors).toBeDefined();
      expect(countryErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if country is not string`, async () => {
      const mockObject = { country: 0 };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const countryErrors = errors.filter(
        (err) => err.property === `country`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(countryErrors).toBeDefined();
      expect(countryErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if country is not in correct format`, async () => {
      const mockObject = { country: `UNITED STATES` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const countryErrors = errors.filter(
        (err) => err.property === `country`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(countryErrors).toBeDefined();
      expect(countryErrors.constraints).toEqual(
        expect.objectContaining({
          isCountryValid: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the country is correct`, async () => {
      // create a country with correct format
      const mockObject = { country: `US` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const countryErrors = errors.filter(
        (err) => err.property === `country`,
      )[0];

      expect(countryErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Website`, () => {
    it(`should fail if website is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(websiteErrors).toBeDefined();
      expect(websiteErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if website is empty`, async () => {
      const mockObject = { website: `` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(websiteErrors).toBeDefined();
      expect(websiteErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if website is not string`, async () => {
      const mockObject = { website: 0 };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(websiteErrors).toBeDefined();
      expect(websiteErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if website is not url`, async () => {
      const mockObject = { website: `not url string` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(websiteErrors).toBeDefined();
      expect(websiteErrors.constraints).toEqual(
        expect.objectContaining({
          isUrl: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if website protocol is not http or https`, async () => {
      const mockObject = { website: `ftp://www.example.com` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(websiteErrors).toBeDefined();
      expect(websiteErrors.constraints).toEqual(
        expect.objectContaining({
          isUrl: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the website is correct`, async () => {
      // create a website with correct format
      const mockObject = { website: `http://example.com` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const websiteErrors = errors.filter(
        (err) => err.property === `website`,
      )[0];

      expect(websiteErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Linkedin`, () => {
    it(`should fail if linkedin is empty`, async () => {
      const mockObject = { linkedin: `` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(linkedinErrors).toBeDefined();
      expect(linkedinErrors.constraints).toEqual(
        expect.objectContaining({
          isNotEmpty: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if linkedin is not string`, async () => {
      const mockObject = { linkedin: 0 };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(linkedinErrors).toBeDefined();
      expect(linkedinErrors.constraints).toEqual(
        expect.objectContaining({
          isString: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if linkedin is not url`, async () => {
      const mockObject = { linkedin: `not url string` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(linkedinErrors).toBeDefined();
      expect(linkedinErrors.constraints).toEqual(
        expect.objectContaining({
          isUrl: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if linkedin protocol is not http or https`, async () => {
      const mockObject = { linkedin: `ftp://www.example.com` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(linkedinErrors).toBeDefined();
      expect(linkedinErrors.constraints).toEqual(
        expect.objectContaining({
          isUrl: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if linkedin host name is not linkedin`, async () => {
      const mockObject = { linkedin: `www.notLinkedin.com` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(linkedinErrors).toBeDefined();
      expect(linkedinErrors.constraints).toEqual(
        expect.objectContaining({
          isUrl: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the linkedin is correct`, async () => {
      // create a linkedin with correct format
      const mockObject = { linkedin: `http://linkedin.com` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const linkedinErrors = errors.filter(
        (err) => err.property === `linkedin`,
      )[0];

      expect(linkedinErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });

  describe(`Supports Sponsorship Program`, () => {
    it(`should fail if supportsSponsorshipProgram is not provided`, async () => {
      const mockObject = {};
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const supportsSponsorshipProgramErrors = errors.filter(
        (err) => err.property === `supportsSponsorshipProgram`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(supportsSponsorshipProgramErrors).toBeDefined();
      expect(supportsSponsorshipProgramErrors.constraints).toEqual(
        expect.objectContaining({
          isDefined: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should fail if supportsSponsorshipProgram is not Enum`, async () => {
      const mockObject = { supportsSponsorshipProgram: `some random text` };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const supportsSponsorshipProgramErrors = errors.filter(
        (err) => err.property === `supportsSponsorshipProgram`,
      )[0];

      expect(errors.length).not.toBe(0);
      expect(supportsSponsorshipProgramErrors).toBeDefined();
      expect(supportsSponsorshipProgramErrors.constraints).toEqual(
        expect.objectContaining({
          isEnum: expect.any(String),
        }),
      );
      expect.hasAssertions();
    });

    it(`should pass if the supportsSponsorshipProgram is correct`, async () => {
      const mockObject = { supportsSponsorshipProgram: SponsorshipSupport.YES };
      const mockedInstance = plainToInstance(CreateCompanyDto, mockObject);

      const errors = await validate(mockedInstance);
      const supportsSponsorshipProgramErrors = errors.filter(
        (err) => err.property === `supportsSponsorshipProgram`,
      )[0];

      expect(supportsSponsorshipProgramErrors).not.toBeDefined();
      expect.hasAssertions();
    });
  });
});
