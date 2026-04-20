/*
  Warnings:

  - You are about to drop the column `requestBody` on the `audit_bot_api_request_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `requestHeaders` on the `audit_bot_api_request_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `audit_bot_api_request_exceptions` table. All the data in the column will be lost.
  - Added the required column `status_code` to the `audit_bot_api_request_exceptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audit_bot_api_request_exceptions" DROP COLUMN "requestBody",
DROP COLUMN "requestHeaders",
DROP COLUMN "statusCode",
ADD COLUMN     "request_body" TEXT,
ADD COLUMN     "request_headers" TEXT,
ADD COLUMN     "status_code" INTEGER NOT NULL;
