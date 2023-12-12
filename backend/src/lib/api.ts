import { HttpStatusCode } from "axios";
import { Response } from "express";

export abstract class API {
  public send<T>(
    res: Response,
    data: T,
    message: string = "Request successful",
    statusCode: number = HttpStatusCode.Ok
  ) {
    return res.status(statusCode).json({ message, data });
  }
}
