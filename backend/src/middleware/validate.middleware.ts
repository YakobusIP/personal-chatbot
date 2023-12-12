import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { ZodValidationError } from "../lib/errors";
import ValidationError from "../types/validation.type";

export const validateMiddleware =
  (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      let err = error;
      if (err instanceof ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }));
      }
      next(
        new ZodValidationError(
          "Request validation failed",
          err as ValidationError[]
        )
      );
    }
  };
