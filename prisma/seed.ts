import { PrismaClient } from '@prisma/client';

import { MuscleGroupFixtures } from '../testing/fixtures';
const prisma = new PrismaClient();
async function main() {
  // const { id: userid, ...user } = UserFixtures.generate({ id: 1, email: 'aurel56@gmail.com' });

  // const { id, ...chest } = MuscleGroupFixtures.generate({ id: 1, name: 'Chest' });
  const { id: backid, ...back } = MuscleGroupFixtures.generate({ id: 2, name: 'Back' });
  const { id: legid, ...legs } = MuscleGroupFixtures.generate({ id: 3, name: 'Legs' });
  // const { id: tricepsid, ...triceps } = MuscleGroupFixtures.generate({ id: 4, name: 'Triceps' });
  // const { id: bicepsid, ...biceps } = MuscleGroupFixtures.generate({ id: 5, name: 'Biceps' });

  const muscleGroup = [back, legs];

  // const alice = await prisma.user.create({ data: user });
  await prisma.muscleGroup.createMany({
    data: muscleGroup,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
