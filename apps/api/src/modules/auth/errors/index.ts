import { HttpException, HttpStatus } from "@nestjs/common";

export const UserNotFoundErrorCode = "USER_NOT_FOUND";

export class UserNotFoundError extends HttpException {
  readonly code = UserNotFoundErrorCode;

  constructor(message: string = "User not found", cause?: Error) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, { cause });
  }
}

export const DuplicateEmailErrorCode = "DUPLICATE_EMAIL";
export class DuplicateEmailError extends HttpException {
  readonly code = DuplicateEmailErrorCode;

  constructor(message: string = "Duplicate email", cause?: Error) {
    super(message, HttpStatus.CONFLICT, { cause });
  }
}
