import { Router } from "express";
import { ChatController } from "../controller/chat.controller";
import { chatEventHandler } from "../controller/event.controller";
import { validateMiddleware } from "../middleware/validate.middleware";
import { updateTopicSchema } from "../schema/chat.schema";

class ChatRouter {
  public router: Router;
  private readonly controller: ChatController;

  constructor() {
    this.router = Router();
    this.controller = new ChatController();
    this.routes();
  }

  public routes(): void {
    this.router.get("/room-list", this.controller.getChatRooms);
    this.router.get("/history/:chatId", this.controller.getChatHistory);
    this.router.post("/", this.controller.createNewChatRoom);
    this.router.put(
      "/update-topic",
      validateMiddleware(updateTopicSchema),
      this.controller.updateChatRoomTopic
    );
    this.router.delete("/", this.controller.deleteAllChat);
    this.router.delete("/:chatId", this.controller.deleteChatOnId);
  }
}

export default new ChatRouter().router;
