/*
  Warnings:

  - You are about to drop the column `text` on the `bot_unauthorized_user_actions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bot_unauthorized_user_actions" DROP COLUMN "text",
ADD COLUMN     "action" TEXT,
ADD COLUMN     "command" TEXT;
