import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 400) {
      response.status(status).json({
        success: false,
        errors: [exception.message],
      });
      // check for 500 family error
    } else if (status.toString().startsWith(`5`)) {
      response.status(status).json({
        success: false,
        errors: [`Something went wrong!`],
      });
    }
  }
}
