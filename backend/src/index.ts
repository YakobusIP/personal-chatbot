import express from "express";
import { createServer } from "http";
import chatRouter from "./routes/chat.router";
import authRouter from "./routes/auth.router";
import { json } from "body-parser";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { Server } from "socket.io";
import { prisma } from "./lib/prisma";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { errorMiddleware } from "./middleware/error.middleware";

interface Message {
  id: string;
  chatId: string;
  author: string;
  content: string;
}

enum ChatRole {
  USER = "Me",
  CHATBOT = "ChatGPT"
}

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
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
      modelName: "gpt-4-1106-preview",
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

    const prompt_template = `You are a helpful chatbot that performs like ChatGPT.
        Follow up input: {question}
        AI:`;

    const prompt = new PromptTemplate({
      inputVariables: ["question"],
      template: prompt_template
    });

    const chain = new LLMChain({
      llm: model,
      prompt,
      verbose: true
    });

    await chain.call({
      question: data.content
    });
  });
});

app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(authRouter);
app.use(chatRouter);

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
