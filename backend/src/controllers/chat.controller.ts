import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import ServerSideError from "../custom-errors/server-side-error";
import { StatusCode } from "../enum/status-code.enum";
import Message from "../types/message.type";
import ClientSideError from "../custom-errors/client-side-error";

export const getChatRooms: RequestHandler = async (req, res, next) => {
  try {
    const data = await prisma.chat.findMany({
      select: { id: true, topic: true }
    });

    return res.status(StatusCode.SUCCESS).json({ data });
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
  try {
    await prisma.chat.create({
      data: {
        topic: "New Chat"
      }
    });

    return res.status(StatusCode.CREATED).json({
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
    const topic = await prisma.chat.findFirst({
      where: { id: id },
      select: { topic: true }
    });

    if (!topic) {
      return next(new ClientSideError(404, "Chat not found"));
    }

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

    return res.status(StatusCode.SUCCESS).json({ data, topic: topic.topic });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to fetch chat history"
      )
    );
  }
};

export const addRecentGPTMessage: RequestHandler = async (req, res, next) => {
  const data: Message = req.body.message;

  try {
    // Revalidate if the chat content has been saved before
    const chat = await prisma.message.findFirst({
      where: {
        content: data.content
      }
    });

    if (chat) {
      return next(new ClientSideError(400, "Content already exists"));
    }

    await prisma.message.create({
      data: {
        chatId: data.chatId,
        author: data.author,
        content: data.content
      }
    });

    return res
      .status(StatusCode.CREATED)
      .json({ message: "Recent chat saved" });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to save recent chat"
      )
    );
  }
};

export const editChatTopic: RequestHandler = async (req, res, next) => {
  try {
    await prisma.chat.update({
      where: {
        id: req.body.id
      },
      data: {
        topic: req.body.topic
      }
    });

    return res
      .status(StatusCode.SUCCESS)
      .json({ topic: req.body.topic, message: "Chat topic updated" });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to update chat topic"
      )
    );
  }
};
