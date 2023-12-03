import { Socket } from "socket.io";
import Message from "../types/message.type";
import { ChatRole } from "../enum/chat-role.enum";
import { prisma } from "../lib/prisma";
import { memory } from "../lib/memory";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import { GPTModel } from "../enum/gpt-model.enum";

export const gptSocket = (socket: Socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("send_message", async (data: Message) => {
    await prisma.message.create({
      data: {
        chatId: data.chatId,
        author: data.author,
        content: data.content
      }
    });

    const uuid = uuidv4();

    const model = new ChatOpenAI({
      temperature: 0.5,
      modelName: GPTModel.MAIN_CHAIN,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            socket.emit("receive_message", {
              chatId: data.chatId,
              id: uuid,
              author: ChatRole.CHATBOT,
              content: token
            });
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
      question: data.content
    });
  });
};
