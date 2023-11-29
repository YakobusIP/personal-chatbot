import { CustomError } from "./custom-error";

export default class ServerSideError extends CustomError {
  constructor(statusCode: number, message: string) {
    super(
      "ServerSideError",
      statusCode || 500,
      message || "Internal Server Error"
    );
  }
}
