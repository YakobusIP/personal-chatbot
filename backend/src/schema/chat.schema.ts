import { z } from "zod";

const createQuestionSchema = z.object({
  chatId: z
    .string({ required_error: "Chat id is required" })
    .trim()
    .uuid({ message: "Invalid UUID" }),
  message: z.string().trim()
});

const updateTopicSchema = z.object({
  chatId: z
    .string({ required_error: "Chat id is required" })
    .trim()
    .uuid({ message: "Invalid UUID" }),
  topic: z
    .string({ required_error: "Topic is required" })
    .min(1, "Topic cannot be empty")
});

export { createQuestionSchema, updateTopicSchema };
