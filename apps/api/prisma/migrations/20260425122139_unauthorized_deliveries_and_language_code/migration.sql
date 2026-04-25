-- AlterTable
ALTER TABLE "bot_incoming_messages" ADD COLUMN     "language_code" TEXT;

-- AlterTable
ALTER TABLE "bot_unauthorized_user_actions" ADD COLUMN     "language_code" TEXT;

-- CreateTable
CREATE TABLE "bot_unauthorized_user_delivered_messages" (
    "id" SERIAL NOT NULL,
    "telegram_id" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_unauthorized_user_delivered_messages_pkey" PRIMARY KEY ("id")
);
