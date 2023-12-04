import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  editChatTopic
} from "../controllers/chat.controller";
import { chatEventHandler } from "../controllers/event.controller";

const router = Router();

router.get("/room-list", getChatRooms);
router.get("/:id", getChatHistory);
router.post("/", createNewChat);
router.put("/update-topic", editChatTopic);
router.get("/answer-question", chatEventHandler);

export default router;
