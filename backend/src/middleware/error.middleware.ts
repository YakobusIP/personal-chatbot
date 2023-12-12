import { ErrorRequestHandler } from "express";
import { HttpStatusCode } from "axios";
import { ApiError } from "../lib/errors";

export const errorMiddleware: ErrorRequestHandler = (
  err: ApiError,
  req,
  res,
  next
) => {
  console.error(err);

  const status = err.statusCode ?? HttpStatusCode.InternalServerError;

  res.status(status).json({ message: err.message });

  return next();
};
