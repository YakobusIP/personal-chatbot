import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import ServerSideError from "../custom-errors/server-side-error";
import { StatusCode } from "../enum/status-code.enum";

export const getChatRooms: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const data = await prisma.chat.findMany({
      where: {
        userId
      },
      select: { id: true, topic: true }
    });

    res.status(StatusCode.SUCCESS).json({ data });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch chat rooms"
      )
    );
  }
};

export const createNewChat: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;

  try {
    await prisma.chat.create({ data: { userId } });

    res.status(StatusCode.CREATED).json({
      message: "Chat successfully created"
    });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to create chat"
      )
    );
  }
};

export const getChatHistory: RequestHandler = async (req, res, next) => {
  const id = req.params.id;

  try {
    const data = await prisma.message.findMany({
      where: { chatId: id },
      select: {
        id: true,
        chatId: true,
        author: true,
        content: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.status(StatusCode.SUCCESS).json({ data });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch chat history"
      )
    );
  }
};

interface Message {
  chatId: string;
  id: string;
  author: string;
  content: string;
}

export const addRecentGPTMessage: RequestHandler = async (req, res, next) => {
  const data: Message = req.body.message;

  try {
    await prisma.message.create({
      data: {
        chatId: data.chatId,
        author: data.author,
        content: data.content
      }
    });

    res.status(StatusCode.CREATED).json({ message: "Recent chat saved" });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to save recent chat"
      )
    );
  }
};
