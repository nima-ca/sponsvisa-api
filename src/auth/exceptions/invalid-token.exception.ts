import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTokenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
