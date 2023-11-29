import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import ClientSideError from "../custom-errors/client-side-error";
import ServerSideError from "../custom-errors/server-side-error";
import { StatusCode } from "../enum/status-code.enum";
import { CustomError } from "../custom-errors/custom-error";

interface LoginRequest {
  username: string;
  password: string;
}

export const login: RequestHandler = async (req, res, next) => {
  const { username, password }: LoginRequest = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username
      }
    });

    if (!user) {
      return next(new ClientSideError(StatusCode.NOT_FOUND, "User not found"));
    }

    if (!(await compare(password, user.password))) {
      return next(
        new ClientSideError(StatusCode.UNAUTHORIZED, "Incorrect password")
      );
    }

    const payload = {
      id: user.id,
      username: user.username
    };

    const token = sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "15m"
    });

    res.status(StatusCode.SUCCESS).json({
      message: "Login successful",
      username: user.username,
      token
    });
  } catch (e) {
    return next(
      new ServerSideError(StatusCode.INTERNAL_SERVER_ERROR, "Failed to login")
    );
  }
};
