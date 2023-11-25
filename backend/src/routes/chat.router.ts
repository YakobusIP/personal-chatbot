import { Router } from "express";
import { createNewChat } from "../controllers/chat.controller";

const router = Router();

router.post("/new-chat", createNewChat);

export default router;
