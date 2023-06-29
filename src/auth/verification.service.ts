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
  VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES,
} from "./constants/auth.constants";
import {
  SendVerificationCodeResponseDto,
  VerifyCodeDto,
  VerifyCodeResponseDto,
} from "./dto/verification.dto";
import { CORE_SUCCESS_DTO } from "src/common/constants/dto";

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendCode(user: User, i18n: I18nContext<I18nTranslations>) {
    const verification = await this.prisma.verification.findFirst({
      where: { userId: user.id },
    });

    if (verification) {
      const isCodeExpired = this.isCodeExpired(verification.expiresIn);

      if (!isCodeExpired) {
        const timeToWait = this.getTimeToWaitForNextVerificationCode(
          verification.expiresIn,
        );

        throw new BadRequestException(
          i18n.t(`auth.exceptions.waitForNextCode`, {
            args: {
              time: timeToWait,
            },
          }),
        );
      }

      await this.prisma.verification.delete({ where: { id: verification.id } });
    }

    const code = this.verificationCodeGenerator();
    const codeExpireTime = new Date(
      Date.now() + VERIFICATION_CODE_EXPIRE_TIME_IN_MINUTES * 60 * 1000,
    );
    const to = user.email;
    const subject = `Sponsvisa Verification Code`;
    const text = `
    Sponsvisa Verification Code!
    Welcome ${user.name}
    here is your verification code: ${code}
    `;
    this.mailService.sendEmail(to, subject, text);
    await this.prisma.verification.create({
      data: { code, userId: user.id, expiresIn: codeExpireTime },
    });
  }

  verificationCodeGenerator(): string {
    const verificationCodeGenerator = customAlphabet(
      VERIFICATION_CODE_SEED,
      VERIFICATION_CODE_LENGTH,
    );
    return verificationCodeGenerator();
  }

  isCodeExpired(expiresIn: Date) {
    return Date.now() > expiresIn.getTime();
  }

  getTimeToWaitForNextVerificationCode(expiresIn: Date): number | null {
    const NOW = Date.now();
    const TIME_TO_WAIT = Math.ceil((expiresIn.getTime() - NOW) / 60 / 1000);
    return TIME_TO_WAIT;
  }

  async verifyCode(
    { code }: VerifyCodeDto,
    user: User,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<VerifyCodeResponseDto> {
    if (user.isVerified) {
      throw new BadRequestException(i18n.t(`auth.exceptions.alreadyVerified`));
    }

    const verification = await this.prisma.verification.findFirst({
      where: { userId: user.id, code },
    });

    if (!verification) {
      throw new BadRequestException(
        i18n.t(`auth.exceptions.verificationCodeExpired`),
      );
    }

    const isCodeExpired = this.isCodeExpired(verification.expiresIn);

    if (isCodeExpired) {
      throw new BadRequestException(
        i18n.t(`auth.exceptions.verificationCodeExpired`),
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await this.prisma.verification.delete({ where: { id: verification.id } });

    return CORE_SUCCESS_DTO;
  }

  async sendVerificationCode(
    user: User,
    i18n: I18nContext<I18nTranslations>,
  ): Promise<SendVerificationCodeResponseDto> {
    if (user.isVerified) {
      throw new BadRequestException(i18n.t(`auth.exceptions.alreadyVerified`));
    }

    await this.sendCode(user, i18n);

    return CORE_SUCCESS_DTO;
  }
}
