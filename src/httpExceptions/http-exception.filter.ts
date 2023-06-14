import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { CoreResponseDto } from "src/common/dto/common.dto";

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const error = exception.getResponse() as {
      status: number;
      message: string[];
      error: string;
    };

    if (error.message) {
      const coreResponse: CoreResponseDto = {
        success: false,
        error: error.message[0],
      };
      response.status(status).json(coreResponse);
      return;
    }
    response.status(status).json(error);
  }
}
