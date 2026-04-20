-- CreateTable
CREATE TABLE "bot_incoming_messages" (
    "id" SERIAL NOT NULL,
    "telegramId" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "bot_incoming_messages_pkey" PRIMARY KEY ("id")
);
