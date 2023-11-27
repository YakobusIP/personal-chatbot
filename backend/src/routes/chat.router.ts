import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  addRecentGPTMessage
} from "../controllers/chat.controller";

const router = Router();

router.get("/room-list", getChatRooms);
router.get("/chat/:id", getChatHistory);
router.post("/new-chat", createNewChat);
router.post("/recent-message", addRecentGPTMessage);

export default router;
