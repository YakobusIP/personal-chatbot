import { Socket } from "socket.io";
import Message from "../types/message.type";
import { ChatRole } from "../enum/chat-role.enum";
import { prisma } from "../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import { ConversationSummaryBufferMemory } from "langchain/memory";

// const MAIN_CHAIN_MODEL = 'gpt-4-1106-preview'
const MAIN_CHAIN_MODEL = "gpt-3.5-turbo";
const MEMORY_MODEL = "gpt-3.5-turbo";

const summaryModel = new OpenAI({
  modelName: MEMORY_MODEL,
  temperature: 0
});

const memory = new ConversationSummaryBufferMemory({
  llm: summaryModel,
  maxTokenLimit: 10,
  returnMessages: true
});

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
      modelName: MAIN_CHAIN_MODEL,
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

    // const prompt_template = `You are a helpful chatbot that performs like ChatGPT.
    //     Follow up input: {question}
    //     AI:`;

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
