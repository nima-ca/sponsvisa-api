import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { I18nContext } from "nestjs-i18n";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import {
  VERIFICATION_CODE_SEED,
  VERIFICATION_CODE_LENGTH,
} from "./constants/auth.constants";

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendVerificationCode(user: User, i18n: I18nContext<I18nTranslations>) {
    const currentCode = await this.prisma.verification.findFirst({
      where: { userId: user.id },
    });

    if (currentCode) {
      const timeToWait = this.getTimeToWaitForNextVerificationCode(
        currentCode.createdAt,
      );

      if (timeToWait) {
        throw new BadRequestException(
          i18n.t(`auth.exceptions.waitForNextCode`, {
            args: {
              time: timeToWait,
            },
          }),
        );
      }

      await this.prisma.verification.delete({ where: { id: currentCode.id } });
    }

    const code = this.verificationCodeGenerator();
    const to = user.email;
    const subject = `Sponsvisa Verification Code`;
    const text = `
    Welcome to Sponsvisa!
    here is your verification code: ${code}
    `;
    this.mailService.sendEmail(to, subject, text);
    await this.prisma.verification.create({ data: { code, userId: user.id } });
  }

  verificationCodeGenerator(): string {
    const verificationCodeGenerator = customAlphabet(
      VERIFICATION_CODE_SEED,
      VERIFICATION_CODE_LENGTH,
    );
    return verificationCodeGenerator();
  }

  getTimeToWaitForNextVerificationCode(creationTime: Date): number | null {
    const CURRENT_CODE_CREATED_TIME = creationTime.getTime();
    const MINUTES_TO_EXPIRE = 3;
    const EXPIRE_TIME = MINUTES_TO_EXPIRE * 60 * 1000; // convert to minutes
    const TIME_TO_EXPIRE = CURRENT_CODE_CREATED_TIME + EXPIRE_TIME;
    const NOW = Date.now();
    if (TIME_TO_EXPIRE > NOW) {
      const TIME_TO_WAIT = Math.ceil((TIME_TO_EXPIRE - NOW) / 60 / 1000);
      return TIME_TO_WAIT;
    }

    return null;
  }
}
