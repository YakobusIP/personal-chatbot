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
// router.get("/ask-question", addUserMessage, chatEventHandler);
router.get("/ask-question", chatEventHandler);

export default router;
