-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetCode" TEXT;
ALTER TABLE "User" ADD COLUMN "resetCodeExpiry" DATETIME;
