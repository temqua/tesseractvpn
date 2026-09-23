-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('SUCCEEDED', 'CANCELLED', 'PENDING');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "status" "payment_status" NOT NULL DEFAULT 'PENDING';
