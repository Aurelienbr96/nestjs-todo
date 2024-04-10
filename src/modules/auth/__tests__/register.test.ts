import request from 'supertest';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import { PrismaService } from '../../../modules/common';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
import { PublicUserModel } from '../type';

import { SuperTestResponse } from './types';

describe('POST /register', () => {
  let app: ITestApplication;
  const userToRegister = UserFixtures.generate({ id: 1 });

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Successful register', () => {
    let response: SuperTestResponse<PublicUserModel>;
    let stored: User;

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: userToRegister.email, password: userToRegister.password })
        .expect(201);
      const prisma = app.get(PrismaService);
      stored = await prisma.user.findFirst({
        where: { id: response.body.id },
      });
    });

    it('Should create a user', () => {
      return expect(response.body).toEqual({
        id: userToRegister.id,
        email: userToRegister.email,
        role: userToRegister.role,
        googleId: null,
        referalCode: null,
        refresh: stored.refresh,
      });
    });

    it('should store user with hashed password', async () => {
      if (!stored) throw new Error('unable to find user');
      const { password, ...user } = stored;
      const valid = await bcrypt.compare(userToRegister.password as string, password as string);
      expect(valid).toBe(true);
      expect(user).toEqual({
        id: userToRegister.id,
        googleId: null,
        referalCode: null,
        email: userToRegister.email,
        role: userToRegister.role,
        refresh: stored.refresh,
      });
    });
  });

  it('Should return an error if email is missing', () => {
    const { email, ...payload } = userToRegister;
    return request(app.getHttpServer()).post('/auth/register').send(payload).expect(400);
  });

  it('Should return an error if password is missing', () => {
    const { password, ...payload } = userToRegister;
    return request(app.getHttpServer()).post('/auth/register').send(payload).expect(400);
  });
});
