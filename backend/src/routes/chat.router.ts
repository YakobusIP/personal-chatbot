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
    this.router.get("/rooms", this.controller.getChatRooms);
    this.router.get("/:chatId/history", this.controller.getChatHistory);
    this.router.post("/create-room", this.controller.createNewChatRoom);
    this.router.post(
      "/add-question",
      validateMiddleware(CreateQuestionSchema),
      this.controller.createNewQuestion
    );
    this.router.patch(
      "/:chatId/update-topic",
      validateMiddleware(UpdateTopicSchema),
      this.controller.updateChatRoomTopic
    );
    this.router.delete("/delete-all", this.controller.deleteAllChat);
    this.router.delete("/:chatId/delete", this.controller.deleteChatOnId);
  }
}

export default new ChatRouter().router;
