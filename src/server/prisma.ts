import { INestApplication } from '@nestjs/common';

import { PrismaService } from '../modules';

export async function setUpPrisma(app: INestApplication) {
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}
