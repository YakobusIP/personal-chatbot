import { ConversationSummaryBufferMemory } from "langchain/memory";
import { prisma } from "../lib/prisma";
import { OpenAI } from "langchain/llms/openai";
import { GPTModel } from "../enum/gpt-model.enum";

export default class EventService {
  public async getChatSummary(chatId: string) {
    return await prisma.conversation.findMany({
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
  }

  public async createConversation(chatId: string) {
    return await prisma.conversation.create({
      data: { chatId, summary: "" }
    });
  }

  public async createQuestion(conversationId: string, content: string) {
    return await prisma.message.create({
      data: {
        conversationQuestionId: conversationId,
        author: "USER",
        content: content
      }
    });
  }

  public async createAnswer(conversationId: string, content: string) {
    return await prisma.message.create({
      data: {
        conversationAnswerId: conversationId,
        author: "CHATBOT",
        content: content
      }
    });
  }

  public async updateConversationConnection(
    conversationId: string,
    questionId: string,
    answerId: string
  ) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: { questionId, answerId }
    });
  }

  public async updateConversationSummary(
    conversationId: string,
    summary: string
  ) {
    return await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        summary
      }
    });
  }

  public async generateNewSummary(
    chatId: string,
    inputMessage: string,
    outputMessage: string
  ) {
    const model = new OpenAI({
      modelName: GPTModel.MEMORY,
      temperature: 0
    });

    const memory = new ConversationSummaryBufferMemory({
      llm: model,
      maxTokenLimit: 1000,
      returnMessages: true
    });

    const summaries = await this.getChatSummary(chatId);

    await memory.saveContext(
      { input: inputMessage },
      { output: outputMessage }
    );

    const messages = await memory.chatHistory.getMessages();
    const summary = await memory.predictNewSummary(
      messages,
      summaries.length === 0 ? "" : summaries[0].summary
    );

    return summary;
  }
}
