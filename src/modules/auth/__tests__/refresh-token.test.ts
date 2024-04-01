import request from 'supertest';
import jwt from 'jsonwebtoken';

import { ConfigService } from '../../common';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
import { SuperTestResponse } from '../../../../testing/types';
import { PublicUserModel } from '../type';
import { JWTPayload, RefreshPayload } from '../type/jwt';

describe('POST auth/refresh-token', () => {
  let app: ITestApplication;
  const user = UserFixtures.generate({ id: 1 });

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user] });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should return a user account', async () => {
    const cookie = await app.generateAccessCookie(user.id);

    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', [cookie])
      .send()
      .expect(201)
      .then((response: SuperTestResponse<PublicUserModel>) => {
        expect(response.body).toEqual({
          id: user.id,
          email: user.email,
          role: user.role,
        });
      });
  });

  describe('cookies', () => {
    let cookies: string[];
    beforeAll(async () => {
      const cookie = await app.generateRefreshCookie(user.id);

      cookies = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', cookie)
        .send()
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
      it('should be a valid token', () => {
        const cookie = cookies[1];
        const section = cookie.split(';')[0];
        const [key, token] = section.split('=');

        const config = app.get(ConfigService);
        const decoded = jwt.verify(token, config.get('JWT_REFRESH_SECRET_KEY')) as JWTPayload<RefreshPayload>;
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

  it('should return error 401 with no cookies', () => {
    return request(app.getHttpServer()).post('/auth/refresh-token').set('Cookie', []).send().expect(401);
  });

  it('should return error 401 with invalid cookies', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', ['refresh-token=malformed-cookie'])
      .send()
      .expect(401);
  });
});
