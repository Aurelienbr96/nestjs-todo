import jwt from 'jsonwebtoken';
import { Test } from '@nestjs/testing';
import { generatePrismock } from 'prismock';
import { MuscleGroup, User } from '@prisma/client';
import { INestApplication } from '@nestjs/common';

import { AuthPayload, RefreshPayload } from '../../src/modules/auth/type';
import { AuthService } from '../../src/modules/auth/auth.service';
import { AppModule, Config, ConfigService, PrismaService } from '../../src/modules';
import { configure } from '../../src/server';

import { UserFixtures } from './user.fixtures';

export type LoadFixtures = {
  users?: User[];
  muscleGroups?: MuscleGroup[];
};

export interface ITestApplication {
  generateAccessCookie(userId: number): Promise<string>;
  getHttpServer(): string;
  close(): Promise<void>;
  load(fixtures: LoadFixtures): Promise<void>;
  verifyAccessToken(token: string): Promise<AuthPayload>;
  verifyRefreshToken(token: string): Promise<RefreshPayload>;
  get(service: any): any;
}

export class AppFixtures implements ITestApplication {
  constructor(private _app: INestApplication) {}

  getHttpServer(): string {
    return this._app.getHttpServer();
  }

  close(): Promise<void> {
    return this._app.close();
  }

  get(service: any) {
    return this._app.get(service);
  }

  async load(fixtures: LoadFixtures): Promise<void> {
    const prisma = this._app.get(PrismaService);
    const { users, muscleGroups } = fixtures;

    if (users) {
      prisma.user.createMany({ data: await UserFixtures.hashPasswords(users) });
    }
    if (muscleGroups) {
      prisma.muscleGroup.createMany({ data: muscleGroups });
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

  async generateAccessCookie(userId: number) {
    const auth = this._app.get(AuthService);
    const prisma = this._app.get(PrismaService);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`Unable to find user with id ${userId}`);

    const accessToken = auth.signAccessToken(user.id, user.email, user.role);
    return `access-token=${accessToken}`;
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
