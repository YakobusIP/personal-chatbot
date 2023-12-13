import { Router } from "express";
import { EventController } from "../controller/event.controller";
import { validateMiddleware } from "../middleware/validate.middleware";
import { UpdateTopicSchema } from "../schema/chat.schema";

class EventRouter {
  public router: Router;
  private readonly controller: EventController;

  constructor() {
    this.router = Router();
    this.controller = new EventController();
    this.routes();
  }

  public routes(): void {
    this.router.get("/sse", this.controller.answerQuestion);
  }
}

export default new EventRouter().router;
