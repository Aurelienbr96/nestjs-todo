// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function truncateAllTables() {
  const tables = ['UserToCoach', 'ExerciseMuscleGroup', 'User', 'MuscleGroup', 'Exercise'];
  try {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    }
    console.log('All tables truncated successfully.');
  } catch (error) {
    console.error('Failed to truncate tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

truncateAllTables();
// "reset": "cross-env SKIP_SEEDING=true npx prisma migrate reset --force",
