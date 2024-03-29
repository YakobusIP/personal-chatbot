/*
  Warnings:

  - Added the required column `userId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
