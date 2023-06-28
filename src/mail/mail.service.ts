import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    // Configure the nodemailer transporter
    this.transporter = nodemailer.createTransport({
      service: config.get(`EMAIL_HOST`),
      auth: {
        user: config.get(`EMAIL_USER`),
        pass: config.get(`EMAIL_PASSWORD`),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.get(`EMAIL_USER`),
        to,
        subject,
        text,
      });
    } catch (error) {
      console.error(`Error sending email:`, error);
    }
  }
}
