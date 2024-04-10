-- CreateTable
CREATE TABLE "UserToCoach" (
    "userId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,

    CONSTRAINT "UserToCoach_pkey" PRIMARY KEY ("userId","coachId")
);

-- AddForeignKey
ALTER TABLE "UserToCoach" ADD CONSTRAINT "UserToCoach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToCoach" ADD CONSTRAINT "UserToCoach_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
