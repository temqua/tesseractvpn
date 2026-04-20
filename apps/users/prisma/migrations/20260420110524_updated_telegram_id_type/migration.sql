/*
  Warnings:

  - You are about to drop the column `telegramId` on the `bot_incoming_messages` table. All the data in the column will be lost.
  - Added the required column `telegram_id` to the `bot_incoming_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bot_incoming_messages" DROP COLUMN "telegramId",
ADD COLUMN     "telegram_id" TEXT NOT NULL;
