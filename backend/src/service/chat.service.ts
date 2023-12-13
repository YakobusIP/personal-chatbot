import { prisma } from "../lib/prisma";
import { eventEmitter } from "../lib/event";

export default class ChatService {
  public async getChatRooms() {
    return await prisma.chat.findMany({
      select: { id: true, topic: true },
      orderBy: { createdAt: "asc" }
    });
  }

  public async getChatOnId(chatId: string) {
    return await prisma.chat.findFirst({
      where: { id: chatId },
      select: { topic: true }
    });
  }

  public async getChatHistory(chatId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          {
            conversationQuestion: {
              chatId: chatId
            }
          },
          {
            conversationAnswer: {
              chatId: chatId
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
  }

  public async createChatRoom() {
    return await prisma.chat.create({
      data: {
        topic: "New Chat"
      }
    });
  }

  public async updateChatRoomTopic(chatId: string, topic: string) {
    return await prisma.chat.update({
      where: { id: chatId },
      data: { topic: topic }
    });
  }

  public async deleteAllChatRoom() {
    await prisma.chat.deleteMany({});
    return await prisma.message.deleteMany({});
  }

  public async deleteChatRoomOnId(chatId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        chatId: chatId
      },
      select: {
        id: true
      }
    });

    await prisma.chat.delete({ where: { id: chatId } });
    return await prisma.message.deleteMany({
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
  }

  public publishMessageToEE(chatId: string, message: string) {
    eventEmitter.emit(chatId, message);
  }
}
