import { RequestHandler } from "express";
import Message from "../types/message.type";
import { memory } from "../lib/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import { GPTModel } from "../enum/gpt-model.enum";
import { prisma } from "../lib/prisma";
import { ChatRole } from "../enum/chat-role.enum";
import { eventEmitter } from "../lib/event-emitter";

let response = "";

export const chatEventHandler: RequestHandler = async (req, res, next) => {
  const { chatId, content } = req.query;

  // Save the message
  await prisma.message.create({
    data: {
      chatId: chatId as string,
      author: ChatRole.USER,
      content: content as string
    }
  });

  // Set headers to stay open for SSE
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  };

  res.writeHead(200, headers);

  // Define the model
  const model = new ChatOpenAI({
    temperature: 0.5,
    modelName: GPTModel.MAIN_CHAIN,
    streaming: true,
    callbacks: [
      {
        // Send data each token received from the LLM
        handleLLMNewToken(token) {
          response = response.concat(token);
          res.write(`data: ${JSON.stringify({ data: token })}\n\n`);
        },
        async handleLLMEnd() {
          res.write(`data: ${JSON.stringify({ data: "[DONE]" })}\n\n`);
          await prisma.message.create({
            data: {
              author: ChatRole.CHATBOT,
              content: response,
              chatId: chatId as string
            }
          });
          response = "";
          res.end();
        }
      }
    ]
  });

  const history = await memory.loadMemoryVariables({});
  console.log({ history });

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a conversation between a human and an AI. The AI performs like ChatGPT"
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{question}")
  ]);

  const chain = new ConversationChain({
    llm: model,
    memory,
    prompt,
    verbose: true
  });

  await chain.predict({
    question: content as string
  });

  req.on("close", () => {
    console.log("event closed");
  });
};
