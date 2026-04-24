/*
  Warnings:

  - You are about to drop the `bot_unauthorized_users_actions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "vpn_servers" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "bot_unauthorized_users_actions";

-- CreateTable
CREATE TABLE "bot_unauthorized_user_actions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telegram_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT,

    CONSTRAINT "bot_unauthorized_user_actions_pkey" PRIMARY KEY ("id")
);
