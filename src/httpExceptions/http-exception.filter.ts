import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { CoreResponseDto } from "src/common/dto/common.dto";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 400) {
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

      response.status(status).json({
        success: false,
        error: exception.message,
      });
      // check for 500 family error
    } else if (status.toString().startsWith(`5`)) {
      response.status(status).json({
        success: false,
        error: `Something went wrong!`,
      });
    }
  }
}
