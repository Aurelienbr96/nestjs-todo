/*
  Warnings:

  - You are about to drop the column `sub` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'COACH';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sub",
ADD COLUMN     "googleId" VARCHAR(255);
