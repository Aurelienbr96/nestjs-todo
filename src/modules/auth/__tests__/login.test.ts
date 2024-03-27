import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { AppFixtures, UserFixtures } from '../../../../testing/fixtures';
import { PublicUserModel } from '../type';
import { ConfigService } from '../../common';
import { RefreshPayload, JWTPayload } from '../type/jwt';

import { SuperTestResponse } from './types';

describe('POST auth/login', () => {
  let app: INestApplication;
  const userToLogin = {
    email: UserFixtures.account.user.email,
    password: UserFixtures.account.user.password,
  };

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an user account', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(userToLogin)
      .expect(201)
      .then((response: SuperTestResponse<PublicUserModel>) => {
        expect(response.body).toEqual({
          id: UserFixtures.stored.user.id,
          email: UserFixtures.stored.user.email,
          role: UserFixtures.stored.user.role,
        });
      });
  });

  describe('cookies', () => {
    let cookies: string[];
    beforeAll(async () => {
      cookies = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userToLogin)
        .expect(201)
        .then((response: SuperTestResponse<PublicUserModel>) => {
          return response.header['set-cookie'];
        });
    });

    describe('access-token', () => {
      it('should be a valid token', () => {
        const cookie = cookies[0];
        const section = cookie.split(';')[0];
        const [key, token] = section.split('=');

        const config = app.get(ConfigService);
        const decoded = jwt.verify(token, config.get('JWT_SECRET_KEY'));
        expect(decoded.sub).toBe(UserFixtures.stored.user.id);
        expect(key).toBe('access-token');
      });

      it('Should be secure', () => {
        const cookie = cookies[0];
        const sections = cookie.split(';');
        expect(sections[3]).toBe(' HttpOnly');
        expect(sections[4]).toBe(' Secure');
        expect(sections[5]).toBe(' SameSite=Strict');
      });
    });

    describe('refresh-token', () => {
      it('should be a valid token', () => {
        const cookie = cookies[1];
        const section = cookie.split(';')[0];
        const [key, token] = section.split('=');

        const config = app.get(ConfigService);
        const decoded = jwt.verify(
          token,
          config.get('JWT_REFRESH_SECRET_KEY'),
        ) as JWTPayload<RefreshPayload>;
        expect(decoded.sub).toBeDefined();
        expect(decoded.userId).toBe(UserFixtures.stored.user.id);
        expect(key).toBe('refresh-token');
      });

      it('Should be secure', () => {
        const cookie = cookies[1];
        const sections = cookie.split(';');
        expect(sections[3]).toBe(' HttpOnly');
        expect(sections[4]).toBe(' Secure');
        expect(sections[5]).toBe(' SameSite=Strict');
      });
    });
  });

  it('should return error 401 with invalid password', async () => {
    const badUserToLogin = {
      email: `bad-${UserFixtures.stored.user.email}`,
      password: UserFixtures.stored.user.password,
    };

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(badUserToLogin)
      .expect(401);
  });

  it('should return error 401 with invalid email', async () => {
    const badUserToLogin = {
      email: `${UserFixtures.stored.user.email}`,
      password: `bad-${UserFixtures.stored.user.password}`,
    };

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(badUserToLogin)
      .expect(401);
  });
});
