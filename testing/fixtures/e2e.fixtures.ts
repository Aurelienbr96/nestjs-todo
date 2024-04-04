/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthPayload, RefreshPayload } from 'src/modules/auth/type';

import { Config, ConfigService } from '../../src/modules';

import { ITestApplication, LoadFixtures } from './app.fixtures';

const config = new ConfigService();

export class e2eFixtures implements ITestApplication {
  generateAccessCookie(_userId: number): Promise<string> {
    throw new Error('Method not implemented.');
  }

  generateRefreshCookie(_userId: number): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getHttpServer(): string {
    return `http://localhost:${config.get(Config.Port)}`;
  }

  close(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  load(_fixtures: LoadFixtures): Promise<void> {
    throw new Error('Method not implemented.');
  }

  verifyAccessToken(_token: string): Promise<AuthPayload> {
    throw new Error('Method not implemented.');
  }

  verifyRefreshToken(_token: string): Promise<RefreshPayload> {
    throw new Error('Method not implemented.');
  }

  get(_service: any) {
    throw new Error('Method not implemented.');
  }
}
