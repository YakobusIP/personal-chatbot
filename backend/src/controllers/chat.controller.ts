import { Request, Response } from "express";
import { prisma } from "../prisma";

export const createNewChat = async (_: Request, res: Response) => {
  try {
    await prisma.chat.create({});

    res.status(201).json({
      message: "Chat successfully created"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Failed to create chat"
    });
  }
};
