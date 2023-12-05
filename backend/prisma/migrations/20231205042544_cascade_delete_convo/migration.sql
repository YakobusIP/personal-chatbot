-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_questionId_fkey";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
