import { Request, RequestHandler, Response } from "express";
import { prisma } from "../prisma";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export const getChatRooms: RequestHandler = async (req, res) => {
  try {
    const data = await prisma.chat.findMany({
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

export const createNewChat: RequestHandler = async (_, res) => {
  try {
    const data = await prisma.chat.create({});

    res.status(201).json({
      data,
      message: "Chat successfully created"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Failed to create chat"
    });
  }
};

export const getChatHistory: RequestHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await prisma.message.findMany({
      where: { chatId: id },
      select: {
        id: true,
        chatId: true,
        author: true,
        content: true
      }
    });

    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Failed to fetch chat history"
    });
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
        id: data.id,
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
