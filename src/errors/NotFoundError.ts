import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor(private msg: string) {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: this.msg }];
  }
}
