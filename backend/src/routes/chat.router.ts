import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  sendChat
} from "../controllers/chat.controller";

const router = Router();

router.get("/room-list", getChatRooms);
router.get("/chat/:id", getChatHistory);
router.post("/new-chat", createNewChat);
router.post("/ask-question", sendChat);

export default router;
