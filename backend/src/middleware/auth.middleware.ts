import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { StatusCode } from "../enum/status-code.enum";
import ClientSideError from "../custom-errors/client-side-error";

interface JWTAuthPayload extends JwtPayload {
  id: string;
  username: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const token = header.split("Bearer ")[1];

  if (!token) {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  verify(token, process.env.SECRET_KEY as string, (error, user) => {
    try {
      const { id } = user as JWTAuthPayload;
      if (!error) {
        Object.assign(req.body, { userId: id });
        return next();
      }
    } catch (e) {
      return next(new ClientSideError(StatusCode.UNAUTHORIZED, "Unauthorized"));
    }
  });
};
