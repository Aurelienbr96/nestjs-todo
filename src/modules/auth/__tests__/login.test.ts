import request from 'supertest';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
import { PublicUserModel } from '../type';

import { SuperTestResponse } from './types';

describe('POST auth/login', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });

  const userToLogin = {
    email: user.email,
    password: user.password,
  };

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user] });
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
          id: user.id,
          email: user.email,
          googleId: null,
          role: user.role,
          referalCode: null,
        });
      });
  });

  describe('cookies', () => {
    let cookies: string[] | string;
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
      it('should be a valid token', async () => {
        const cookie = cookies[0];
        const section = cookie.split(';')[0];
        const [key, token] = section.split('=');

        const decoded = await app.verifyAccessToken(token);
        expect(decoded.sub).toBe(user.id);
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
      it('should be a valid token', async () => {
        const cookie = cookies[1];
        const section = cookie.split(';')[0];
        const [key, token] = section.split('=');

        const decoded = await app.verifyRefreshToken(token);

        expect(decoded.sub).toBeDefined();
        expect(decoded.userId).toBe(user.id);
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
      email: `bad-${user.email}`,
      password: user.password,
    };

    return await request(app.getHttpServer()).post('/auth/login').send(badUserToLogin).expect(401);
  });

  it('should return error 401 with invalid email', async () => {
    const badUserToLogin = {
      email: `${user.email}`,
      password: `bad-${user.password}`,
    };

    return await request(app.getHttpServer()).post('/auth/login').send(badUserToLogin).expect(401);
  });
});
