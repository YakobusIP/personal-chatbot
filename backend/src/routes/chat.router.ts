import { Router } from "express";
import { ChatController } from "../controller/chat.controller";
import { validateMiddleware } from "../middleware/validate.middleware";
import { CreateQuestionSchema, UpdateTopicSchema } from "../schema/chat.schema";

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
    this.router.post(
      "/question",
      validateMiddleware(CreateQuestionSchema),
      this.controller.createNewQuestion
    );
    this.router.put(
      "/update-topic",
      validateMiddleware(UpdateTopicSchema),
      this.controller.updateChatRoomTopic
    );
    this.router.delete("/", this.controller.deleteAllChat);
    this.router.delete("/:chatId", this.controller.deleteChatOnId);
  }
}

export default new ChatRouter().router;
