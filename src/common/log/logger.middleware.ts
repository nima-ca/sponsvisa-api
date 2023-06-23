import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestLog = {
      body: JSON.stringify(this.checkPasswordInBody(req)),
      url: JSON.stringify(req.baseUrl + req.url),
      method: JSON.stringify(req.method),
    };

    this.prisma.log
      .create({
        data: {
          ...requestLog,
        },
      })
      .catch((error) => console.log(error));

    next();
  }

  checkPasswordInBody(req: Request) {
    return {
      ...req.body,
      ...(req.body[`password`] && { password: `********` }),
      ...(req.body[`confirmPassword`] && { confirmPassword: `********` }),
    };
  }
}
