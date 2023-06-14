import { HttpException, HttpStatus } from "@nestjs/common";

export class IncorrectCredentialsException extends HttpException {
  constructor() {
    super(`Email or password is not correct!`, HttpStatus.BAD_REQUEST);
  }
}
