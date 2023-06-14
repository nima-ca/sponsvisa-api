import { HttpException, HttpStatus } from "@nestjs/common";

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(`User already exists with the same email!`, HttpStatus.BAD_REQUEST);
  }
}
