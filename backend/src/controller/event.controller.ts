import { RequestHandler } from "express";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import { GPTModel } from "../enum/gpt-model.enum";
import EventService from "../service/event.service";
import { eventEmitter } from "../lib/event";

export class EventController {
  private readonly eventService = new EventService();
  private userQuestion: string = "";
  private GPTAnswer: string = "";
  private SSEMARK: string = "[DONE]";

  public answerQuestion: RequestHandler = async (req, res, next) => {
    const { chatId } = req.query as { chatId: string };

    // Subscribe to event emitter
    eventEmitter.on(chatId, (response) => {
      console.log(response);
      this.userQuestion = response;
    });

    console.log(this, "outside");

    // Generate a new conversation entry
    const conversation = await this.eventService.createConversation(chatId);

    // Save the question
    const question = await this.eventService.createQuestion(
      conversation.id,
      this.userQuestion
    );

    // Set headers to stay open for SSE
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    };

    res.writeHead(200, headers);

    // Define the model
    const model = new ChatOpenAI({
      temperature: 0.5,
      modelName: GPTModel.MAIN_CHAIN,
      streaming: true,
      callbacks: [
        {
          // Send data each token received from the LLM
          handleLLMNewToken: (token) => {
            this.GPTAnswer = this.GPTAnswer.concat(token);
            res.write(
              `data: ${JSON.stringify({
                data: token,
                conversationId: conversation.id
              })}\n\n`
            );
          },
          // When LLM Chain ends, send ending mark and save the final response to the database
          handleLLMEnd: async () => {
            // Send the ending mark (marked as [DONE])
            res.write(
              `data: ${JSON.stringify({
                data: this.SSEMARK,
                conversationId: conversation.id
              })}\n\n`
            );

            // Save the answer message
            const answer = await this.eventService.createAnswer(
              conversation.id,
              this.GPTAnswer
            );

            // Update the conversation entry to fit both question and answer id
            await this.eventService.updateConversationConnection(
              conversation.id,
              question.id,
              answer.id
            );

            // Generate new summary
            const summary = await this.eventService.generateNewSummary(
              chatId,
              this.userQuestion,
              this.GPTAnswer
            );

            // Update the summary in the database
            await this.eventService.updateConversationSummary(
              conversation.id,
              summary
            );

            this.GPTAnswer = "";
            res.end();
          }
        }
      ]
    });

    // Fetch last conversation summary
    const summaries = await this.eventService.getChatSummary(chatId);

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "The following is a conversation between a human and an AI. The AI performs like ChatGPT. These are the chat contexts: {context}"
      ),
      HumanMessagePromptTemplate.fromTemplate("{input}")
    ]);

    const chain = new LLMChain({
      llm: model,
      prompt,
      verbose: true
    });

    await chain.predict({
      context: summaries.length === 0 ? "" : summaries[0].summary,
      input: this.userQuestion
    });

    req.on("close", () => {
      console.log("event closed");
    });
  };
}
