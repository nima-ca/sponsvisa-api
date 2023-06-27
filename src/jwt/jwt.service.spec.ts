import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "./jwt.service";
import { ConfigService } from "@nestjs/config";
import * as JWT from "jsonwebtoken";

jest.mock(`jsonwebtoken`, () => {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
  };
});

const mockConfigService = {
  get: jest.fn(),
};

describe(`JwtService`, () => {
  let service: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
  });

  describe(`signAccessToken`, () => {
    const payload = { userId: 1 };
    const secret = `your_secret_key`;
    const expiresIn = `7d`;

    it(`should sign and return an access token`, () => {
      jest
        .spyOn(configService, `get`)
        .mockReturnValue({ access: { secret, time: expiresIn } });

      service.signAccessToken(payload);

      expect(configService.get).toHaveBeenCalledWith(`jwt`);
      expect(JWT.sign).toHaveBeenCalledWith(payload, secret, { expiresIn });
      expect.hasAssertions();
    });
  });

  describe(`verifyAccessToken`, () => {
    const token = `your_access_token`;
    const secret = `your_secret_key`;
    const payload = { userId: 1 };

    it(`should verify and return the decoded payload if valid`, () => {
      jest.spyOn(configService, `get`).mockReturnValue({
        access: { secret },
      });

      jest.mocked(JWT.verify).mockImplementation(() => payload);

      const result = service.verifyAccessToken(token);

      expect(configService.get).toHaveBeenCalledWith(`jwt`);
      expect(JWT.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toEqual(payload);
      expect.hasAssertions();
    });

    it(`should return null if token verification fails`, () => {
      jest.spyOn(configService, `get`).mockReturnValue({
        access: { secret },
      });

      jest.mocked(JWT.verify).mockImplementation(() => {
        throw new Error(`Token verification failed`);
      });

      const result = service.verifyAccessToken(token);

      expect(configService.get).toHaveBeenCalledWith(`jwt`);
      expect(JWT.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toBeNull();
      expect.hasAssertions();
    });
  });
});
