import { CustomError } from "./custom-error";

export default class ClientSideError extends CustomError {
  constructor(statusCode: number, message: string) {
    super("ClientSideError", statusCode || 400, message || "Bad Request");
  }
}
