import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import ServerSideError from "../custom-errors/server-side-error";
import { StatusCode } from "../enum/status-code.enum";
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
    const data = await prisma.chat.create({
      data: {
        topic: "New Chat"
      }
    });

    return res.status(StatusCode.CREATED).json({
      data,
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
      where: {
        OR: [
          {
            conversationQuestion: {
              chatId: id
            }
          },
          {
            conversationAnswer: {
              chatId: id
            }
          }
        ]
      },
      select: {
        id: true,
        author: true,
        content: true,
        conversationQuestionId: true,
        conversationAnswerId: true
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

export const deleteAllChat: RequestHandler = async (req, res, next) => {
  try {
    await prisma.chat.deleteMany({});
    await prisma.message.deleteMany({});

    return res
      .status(StatusCode.SUCCESS)
      .json({ message: "All chats deleted" });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete all chat"
      )
    );
  }
};

export const deleteChatOnId: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        chatId: id
      },
      select: {
        id: true
      }
    });

    await prisma.chat.delete({ where: { id } });
    await prisma.message.deleteMany({
      where: {
        OR: [
          {
            conversationQuestionId: {
              in: conversations.map((item) => item.id)
            }
          },
          {
            conversationAnswerId: {
              in: conversations.map((item) => item.id)
            }
          }
        ]
      }
    });

    return res.status(StatusCode.SUCCESS).json({ message: "Chat deleted" });
  } catch (e) {
    return next(
      new ServerSideError(
        StatusCode.INTERNAL_SERVER_ERROR,
        "Failed to delete chat"
      )
    );
  }
};
