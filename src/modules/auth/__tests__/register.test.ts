import request from 'supertest';
import bcrypt from 'bcryptjs';

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

    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: userToRegister.email, password: userToRegister.password })
        .expect(201);
    });

    it('Should create a user', () => {
      return expect(response.body).toEqual({
        id: userToRegister.id,
        email: userToRegister.email,
        role: userToRegister.role,
      });
    });

    it('should store user with hashed password', async () => {
      const prisma = app.get(PrismaService);
      const stored = await prisma.user.findFirst({
        where: { id: response.body.id },
      });
      if (!stored) throw new Error('unable to find user');
      const { password, ...user } = stored;
      const valid = await bcrypt.compare(userToRegister.password, password);
      expect(valid).toBe(true);
      expect(user).toEqual({
        id: userToRegister.id,
        email: userToRegister.email,
        role: userToRegister.role,
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
