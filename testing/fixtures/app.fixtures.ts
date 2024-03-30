import jwt from 'jsonwebtoken';
import { Test } from '@nestjs/testing';
import { generatePrismock } from 'prismock';

import { configure } from '../../src/server';
import { AppModule, Config, ConfigService, PrismaService } from '../../src/modules';

import { User } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AuthPayload, RefreshPayload } from 'src/modules/auth/type';
import { UserFixtures } from './user.fixtures';

export type LoadFixtures = {
  users: User[];
};

export interface ITestApplication {
  getHttpServer(): string;
  close(): Promise<void>;
  load(fixtures: LoadFixtures): Promise<void>;
  verifyAccessToken(token: string): Promise<AuthPayload>;
  verifyRefreshToken(token: string): Promise<RefreshPayload>;
}

export class AppFixtures implements ITestApplication {
  constructor(private _app: INestApplication) {}

  getHttpServer(): string {
    return this._app.getHttpServer();
  }

  close(): Promise<void> {
    return this._app.close();
  }

  async load(fixtures: LoadFixtures): Promise<void> {
    const prisma = this._app.get(PrismaService);
    const { users } = fixtures;

    if (users) {
      prisma.user.createMany({ data: await UserFixtures.hashPasswords(users) });
    }
  }

  verifyAccessToken(token: string) {
    const config = this._app.get(ConfigService);

    return new Promise<AuthPayload>((resolve, reject) => {
      jwt.verify(token, config.get(Config.Secret), async (err, decoded) => {
        if (err) reject(new Error('Unable to decode token'));
        if (decoded) {
          resolve(decoded as unknown as AuthPayload);
        } else reject(new Error('Empty token'));
      });
    });
  }

  verifyRefreshToken(token: string) {
    const config = this._app.get(ConfigService);

    return new Promise<RefreshPayload>((resolve, reject) => {
      jwt.verify(token, config.get(Config.RefreshSecret), async (err, decoded) => {
        if (err) reject(new Error('Unable to decode token'));
        if (decoded) {
          resolve(decoded as RefreshPayload);
        } else reject(new Error('Empty token'));
      });
    });
  }

  static async createApplication() {
    const prisMock = await generatePrismock();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisMock)
      .compile();

    const app = moduleRef.createNestApplication();
    configure(app);
    await app.init();

    return new AppFixtures(app);
  }
}
