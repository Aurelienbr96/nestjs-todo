/*
  Warnings:

  - You are about to drop the column `muscleGroupId` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroupId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
