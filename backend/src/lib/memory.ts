import { OpenAI } from "langchain/llms/openai";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import { GPTModel } from "../enum/gpt-model.enum";

const model = new OpenAI({
  modelName: GPTModel.MEMORY,
  temperature: 0
});

const globalForMemory = globalThis as unknown as {
  memory: ConversationSummaryBufferMemory;
};

export const memory =
  globalForMemory.memory ||
  new ConversationSummaryBufferMemory({
    llm: model,
    maxTokenLimit: 1000,
    returnMessages: true
  });

if (process.env.NODE_ENV !== "production") globalForMemory.memory = memory;
