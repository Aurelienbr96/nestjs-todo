/*
  Warnings:

  - The primary key for the `TrainingExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TrainingExercise" DROP CONSTRAINT "TrainingExercise_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "restAfterExercise" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "TrainingExercise_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "weight" INTEGER NOT NULL,
    "rest" INTEGER NOT NULL,
    "trainingExerciseId" INTEGER NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Set_trainingExerciseId_idx" ON "Set"("trainingExerciseId");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_trainingExerciseId_fkey" FOREIGN KEY ("trainingExerciseId") REFERENCES "TrainingExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
