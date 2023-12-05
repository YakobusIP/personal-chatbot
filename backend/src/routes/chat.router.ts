import { Router } from "express";
import {
  getChatRooms,
  createNewChat,
  getChatHistory,
  editChatTopic,
  deleteAllChat,
  deleteChatOnId
} from "../controllers/chat.controller";
import { chatEventHandler } from "../controllers/event.controller";

const router = Router();

router.get("/room-list", getChatRooms);
router.get("/history/:id", getChatHistory);
router.post("/", createNewChat);
router.put("/update-topic", editChatTopic);
router.delete("/", deleteAllChat);
router.delete("/:id", deleteChatOnId);
router.get("/answer-question", chatEventHandler);

export default router;
