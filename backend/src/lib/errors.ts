import { HttpStatusCode } from "axios";
import ValidationError from "../types/validation-error.type";

interface IAPiError extends Error {
  statusCode: number;
  rawErrors?: string[] | ValidationError[];
}

export class ApiError extends Error implements IAPiError {
  statusCode: number;
  rawErrors?: string[] | ValidationError[] | undefined;
  constructor(
    statusCode: number,
    message: string,
    rawErrors?: string[] | ValidationError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    if (rawErrors) {
      this.rawErrors = rawErrors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTPBadRequestError extends ApiError {
  constructor(message: string, errors: string[]) {
    super(HttpStatusCode.BadRequest, message, errors);
  }
}

export class HTTPInternalServerError extends ApiError {
  constructor(message: string, errors: string[]) {
    super(HttpStatusCode.InternalServerError, message, errors);
  }
}

export class HTTPUnauthorizedError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.Unauthorized, message);
  }
}

export class HTTPNotFoundError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(HttpStatusCode.NotFound, message, errors);
  }
}

export class ZodValidationError extends ApiError {
  constructor(message: string, errors: ValidationError[]) {
    super(HttpStatusCode.BadRequest, message, errors);
  }
}
