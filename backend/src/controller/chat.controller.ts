import { RequestHandler } from "express";
import { API } from "../lib/api";
import ChatService from "../service/chat.service";
import { HttpStatusCode } from "axios";
import { HTTPNotFoundError } from "../lib/errors";

export class ChatController extends API {
  private readonly chatService = new ChatService();

  public getChatRooms: RequestHandler = async (req, res, next) => {
    try {
      const rooms = await this.chatService.getChatRooms();
      return this.send(res, rooms);
    } catch (error) {
      next(error);
    }
  };

  public getChatHistory: RequestHandler = async (req, res, next) => {
    try {
      const chatId = req.params.chatId;

      const chat = await this.chatService.getChatOnId(chatId);

      if (!chat) {
        throw new HTTPNotFoundError("Chat not found");
      }

      const history = await this.chatService.getChatHistory(chatId);

      return this.send(res, history);
    } catch (error) {
      next(error);
    }
  };

  public createNewChatRoom: RequestHandler = async (req, res, next) => {
    try {
      const room = await this.chatService.createChatRoom();
      return this.send(
        res,
        room,
        "Chat successfully created",
        HttpStatusCode.Created
      );
    } catch (error) {
      next(error);
    }
  };

  public updateChatRoomTopic: RequestHandler = async (req, res, next) => {
    try {
      const chat = await this.chatService.getChatOnId(req.body.chatId);

      if (!chat) {
        throw new HTTPNotFoundError("Chat not found");
      }

      const data = await this.chatService.updateChatRoomTopic(
        req.body.chatId,
        req.body.topic
      );

      return this.send(res, data, "Topic updated", HttpStatusCode.Created);
    } catch (error) {
      next(error);
    }
  };

  public deleteAllChat: RequestHandler = async (req, res, next) => {
    try {
      const data = await this.chatService.deleteAllChatRoom();

      return this.send(res, data, "All chats deleted");
    } catch (error) {
      next(error);
    }
  };

  public deleteChatOnId: RequestHandler = async (req, res, next) => {
    try {
      const chatId = req.params.chatId;

      const chat = await this.chatService.getChatOnId(chatId);

      if (!chat) {
        throw new HTTPNotFoundError("Chat not found");
      }

      const data = await this.chatService.deleteChatRoomOnId(chatId);

      return this.send(res, data, "Chat deleted");
    } catch (error) {
      next(error);
    }
  };
}
