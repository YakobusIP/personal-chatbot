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

enum ChatRole {
  USER = "Me",
  CHATBOT = "ChatGPT"
}

export const sendChat: RequestHandler = async (req, res) => {
  const request = req.body;

  try {
    await prisma.message.create({
      data: {
        chatId: request.id,
        author: ChatRole.USER,
        content: request.question
      }
    });

    // const model = new ChatOpenAI({
    //   temperature: 0.5,
    //   modelName: "gpt-4",
    //   streaming: true,
    //   callbacks: [
    //     {
    //       handleLLMNewToken(token) {
    //         const response: Message = {
    //           chatId: request.chatId,
    //           author: "ChatGPT",
    //           content: token
    //         };
    //         ws.send(JSON.stringify(response));
    //       }
    //     }
    //   ]
    // });

    // const prompt_template = `You are a helpful chatbot that performs like ChatGPT.
    //   Follow up input: {question}
    //   AI:`;

    // const prompt = new PromptTemplate({
    //   inputVariables: ["question"],
    //   template: prompt_template
    // });

    // const chain = new LLMChain({
    //   llm: model,
    //   prompt,
    //   verbose: true
    // });

    // await chain.call({ question: request.content });

    // ws.send("Successfully added");

    const data = await prisma.message.create({
      data: {
        chatId: request.id,
        author: ChatRole.CHATBOT,
        content: "Hello!"
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
