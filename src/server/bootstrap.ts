import { NestFactory } from '@nestjs/core';
import { AppModule, PrismaService } from 'src/modules';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}
