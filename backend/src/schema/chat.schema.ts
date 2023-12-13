import { z } from "zod";

const CreateQuestionSchema = z.object({
  chatId: z
    .string({ required_error: "Chat id is required" })
    .trim()
    .uuid({ message: "Invalid UUID" }),
  message: z.string().trim()
});

const UpdateTopicSchema = z.object({
  topic: z
    .string({ required_error: "Topic is required" })
    .min(1, "Topic cannot be empty")
});

export { CreateQuestionSchema, UpdateTopicSchema };
