import { PrismaClient } from '@prisma/client';

import { MuscleGroupFixtures, UserFixtures } from '../testing/fixtures';
const prisma = new PrismaClient();

// npx prisma db seed --seed-id=e2e
const seedUser = async () => {
  const { id: userid, ...user } = UserFixtures.generate({
    email: 'aurelien.test@gmail.com',
    id: 1,
    password: 'password12345',
  });

  const hashedPassword = await UserFixtures.hash(user.password as string);

  await prisma.user.create({
    data: { ...user, password: hashedPassword },
  });
};

const seedMuscleGroup = async () => {
  const { id, ...chest } = MuscleGroupFixtures.generate({ id: 1, name: 'Chest' });
  const { id: backid, ...back } = MuscleGroupFixtures.generate({ id: 2, name: 'Back' });
  const { id: legid, ...legs } = MuscleGroupFixtures.generate({ id: 3, name: 'Legs' });
  const { id: tricepsid, ...triceps } = MuscleGroupFixtures.generate({ id: 4, name: 'Triceps' });
  const { id: bicepsid, ...biceps } = MuscleGroupFixtures.generate({ id: 5, name: 'Biceps' });

  const muscleGroup = [back, legs, chest, triceps, biceps];

  await prisma.muscleGroup.createMany({
    data: muscleGroup,
  });
};

const defaultSeed = async () => {
  const { id: coachId, ...coach } = UserFixtures.generate({
    id: 1,
    email: 'coach@gmail.com',
    password: 'password1234',
    role: 'COACH',
  });
  const { id: adminId, ...admin } = UserFixtures.generate({
    id: 2,
    email: 'admin@gmail.com',
    password: 'password1234',
    role: 'ADMIN',
  });
  const { id: userid, ...user } = UserFixtures.generate({
    id: 3,
    email: 'user@gmail.com',
    password: 'password1234',
    role: 'USER',
  });
  const toCreate = [
    { ...coach, password: await UserFixtures.hash(coach.password as string) },
    { ...admin, password: await UserFixtures.hash(admin.password as string) },
    { ...user, password: await UserFixtures.hash(user.password as string) },
  ];
  await seedMuscleGroup();

  await prisma.user.createMany({
    data: toCreate,
  });
};

const seed = {
  user: () => seedUser(),
} as const;

type SeedKeys = keyof typeof seed;

async function main() {
  if (process.env.SKIP_SEEDING === 'true') {
    console.log('Skipping seeding as per environment setting.');
    return;
  }
  const arg = process.argv[2];
  const seedId = process.argv[3] as SeedKeys;

  if (arg === '--seed-id' && seedId) {
    if (seedId in seed) {
      seed[seedId]();
    } else {
      throw new Error('seed id does not exist');
    }
  } else {
    defaultSeed();
  }
  console.log('e2e seeding success');
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
