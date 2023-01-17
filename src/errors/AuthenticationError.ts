import { CustomError } from "./CustomError";

export class AuthenticationError extends CustomError {
  statusCode = 401;
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
  serializeErrors() {
    return [{ message: this.message }];
  }
}
