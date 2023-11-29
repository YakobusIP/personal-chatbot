import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import ServerSideError from "../custom-errors/server-side-error";

export const getChatRooms: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  try {
    const data = await prisma.chat.findMany({
      where: {
        userId
      },
      select: { id: true, topic: true }
    });

    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Fail to fetch rooms"
    });
  }
};

export const createNewChat: RequestHandler = async (req, res, next) => {
  const { userId } = req.body;

  try {
    await prisma.chat.create({ data: { userId: "a" } });

    res.status(201).json({
      message: "Chat successfully created"
    });
  } catch (e) {
    return next(new ServerSideError(500, "Failed to create chat"));
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

    res.status(200).json({ data });
  } catch (e) {
    return next(new ServerSideError(500, "Failed to fetch chat history"));
  }
};

interface Message {
  chatId: string;
  id: string;
  author: string;
  content: string;
}

export const addRecentGPTMessage: RequestHandler = async (req, res) => {
  const data: Message = req.body.message;

  try {
    await prisma.message.create({
      data: {
        chatId: data.chatId,
        author: data.author,
        content: data.content
      }
    });

    res.status(201).json({ message: "Recent chat added" });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Failed to add recent GPT message"
    });
  }
};
