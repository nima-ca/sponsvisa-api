import { Test, TestingModule } from "@nestjs/testing";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

const sendMailMock = jest.fn();
jest.mock(`nodemailer`, () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));

describe(`MailService`, () => {
  let service: MailService;
  let configService: ConfigService;

  const MOCKED_SENDER_EMAIL = `your-email@hotmail.com`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === `EMAIL_HOST`) return `smtp-mail.outlook.com`;
              if (key === `EMAIL_USER`) return MOCKED_SENDER_EMAIL;
              if (key === `EMAIL_PASSWORD`) return `your-email-password`;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it(`should be defined`, () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe(`sendEmail`, () => {
    it(`should send an email successfully`, async () => {
      const to = `recipient@example.com`;
      const subject = `Hello`;
      const text = `This is a test email`;

      await service.sendEmail(to, subject, text);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: MOCKED_SENDER_EMAIL,
        to,
        subject,
        text,
      });
      expect.hasAssertions();
    });
  });
});
