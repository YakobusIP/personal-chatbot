/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "questionId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_questionId_key" ON "Message"("questionId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
