import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  addRecentGPTMessage,
  editChatTopic,
  addUserMessage
} from "../controllers/chat.controller";
import { chatEventHandler } from "../controllers/event.controller";

const router = Router();

router.get("/room-list", getChatRooms);
router.get("/chat/:id", getChatHistory);
router.post("/new-chat", createNewChat);
router.post("/recent-message", addRecentGPTMessage);
router.put("/update-topic", editChatTopic);
router.get("/answer-question", chatEventHandler);
router.post("/ask-question", addUserMessage);

export default router;
