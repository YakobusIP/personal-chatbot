import { ErrorRequestHandler } from "express";
import { HttpStatusCode } from "axios";
import { ApiError, ZodValidationError } from "../lib/errors";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
  err: ApiError,
  req,
  res,
  next
) => {
  console.error(err);

  const status = err.statusCode ?? HttpStatusCode.InternalServerError;

  if (err instanceof ZodValidationError) {
    res.status(status).json({ message: err.message, error: err.rawErrors });
  } else {
    res.status(status).json({ message: err.message });
  }

  return next();
};
