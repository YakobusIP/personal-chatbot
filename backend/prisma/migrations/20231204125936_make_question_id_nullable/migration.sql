-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_questionId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "questionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
