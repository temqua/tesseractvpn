-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('CLIENT', 'ADMIN');

-- AlterTable
ALTER TABLE "bot_incoming_messages" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "user_role" "user_role" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "bot_unauthorized_users_actions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telegram_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "text" TEXT,

    CONSTRAINT "bot_unauthorized_users_actions_pkey" PRIMARY KEY ("id")
);
