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

let response = "";

export const chatEventHandler: RequestHandler = async (req, res, next) => {
  const { chatId, content } = req.query;

  // Generate a new conversation entry
  const conversation = await prisma.conversation.create({
    data: { chatId: chatId as string, summary: "" }
  });

  // Save the message
  const question = await prisma.message.create({
    data: {
      conversationQuestionId: conversation.id,
      author: "USER",
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
          res.write(
            `data: ${JSON.stringify({
              data: token,
              conversationId: conversation.id
            })}\n\n`
          );
        },
        // When LLM Chain ends, send ending mark and save the final response to the database
        async handleLLMEnd() {
          // Send the ending mark (marked as [DONE])
          res.write(
            `data: ${JSON.stringify({
              data: "[DONE]",
              conversationId: conversation.id
            })}\n\n`
          );

          // Save the answer message
          const answer = await prisma.message.create({
            data: {
              conversationAnswerId: conversation.id,
              author: "CHATBOT",
              content: response
            }
          });

          // Update the conversation entry to fit both question and answer id
          await prisma.conversation.update({
            where: {
              id: conversation.id
            },
            data: {
              questionId: question.id,
              answerId: answer.id
            }
          });

          // Fetch last 5 conversation summary
          const summaries = await prisma.conversation.findMany({
            where: {
              chatId: chatId as string
            },
            select: {
              summary: true
            },
            skip: 1,
            take: 1,
            orderBy: {
              createdAt: "desc"
            }
          });

          // Generate new summary
          memory.clear();

          await memory.saveContext(
            { input: content as string },
            { output: response }
          );

          const messages = await memory.chatHistory.getMessages();
          const summary = await memory.predictNewSummary(
            messages,
            summaries.length === 0 ? "" : summaries[0].summary
          );

          await prisma.conversation.update({
            where: {
              id: conversation.id
            },
            data: {
              summary
            }
          });

          response = "";
          res.end();
        }
      }
    ]
  });

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
