import { ErrorRequestHandler } from "express";
import { CustomError } from "../custom-errors/custom-error";

export const errorMiddleware: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next
) => {
  console.error(err);
  return res.status(err.statusCode).json({ message: err.message });
};
