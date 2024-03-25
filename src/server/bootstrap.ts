import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule, ConfigService } from '../modules';

import { setUpSwagger } from './swagger';
import { setUpPrisma } from './prisma';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configure(app);
  await setUpSwagger(app);
  setUpPrisma(app);

  await app.listen(config.getNumber('PORT'));
}

export function configure(app: INestApplication) {
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}
