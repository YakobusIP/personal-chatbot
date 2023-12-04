/*
  Warnings:

  - Changed the type of `author` on the `Message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CHATGPT');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "author",
ADD COLUMN     "author" "Role" NOT NULL;
