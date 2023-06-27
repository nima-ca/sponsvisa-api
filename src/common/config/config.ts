import { IConfig } from "./interfaces/config.interface";

export function config(): IConfig {
  return {
    id: process.env.APP_ID,
    port: parseInt(process.env.PORT, 10),
    domain: process.env.DOMAIN,
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_KEY,
        time: process.env.JWT_ACCESS_TIME,
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: process.env.JWT_CONFIRMATION_TIME,
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: process.env.JWT_RESET_PASSWORD_TIME,
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: process.env.JWT_REFRESH_TIME,
      },
    },
    emailService: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === `true`,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  };
}
