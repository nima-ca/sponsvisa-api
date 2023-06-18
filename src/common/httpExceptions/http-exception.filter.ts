import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { I18nContext } from "nestjs-i18n";
import { CoreResponseDto } from "src/common/dto/common.dto";
import { I18nTranslations } from "src/i18n/generated/i18n.generated";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const resObj: CoreResponseDto = {
      success: false,
      error: [exception.message],
    };

    if (status.toString().startsWith(`5`)) {
      const i18n = I18nContext.current<I18nTranslations>();
      const internalServerError = i18n.t(
        `common.errors.internalServerException`,
      );
      resObj.error = [internalServerError];
      response.status(status).json(resObj);
      return;
    }

    response.status(status).json(resObj);
  }
}
