import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  addRecentGPTMessage
} from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/room-list", authMiddleware, getChatRooms);
router.get("/chat/:id", authMiddleware, getChatHistory);
router.post("/new-chat", authMiddleware, createNewChat);
router.post("/recent-message", authMiddleware, addRecentGPTMessage);

export default router;
