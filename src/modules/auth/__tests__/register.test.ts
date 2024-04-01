import request from 'supertest';
import bcrypt from 'bcryptjs';

import { PrismaService } from '../../../modules/common';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
import { UserToRegisterDTO } from '../dto';
import { PublicUserModel } from '../type';

import { SuperTestResponse } from './types';

describe('POST /register', () => {
  let app: ITestApplication;
  const userToRegister: UserToRegisterDTO = {
    email: UserFixtures.account.create.email,
    password: UserFixtures.account.create.password,
  };

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Successful register', () => {
    let response: SuperTestResponse<PublicUserModel>;

    beforeAll(async () => {
      response = await request(app.getHttpServer()).post('/auth/register').send(userToRegister).expect(201);
    });

    it('Should create a user', () => {
      return expect(response.body).toEqual({
        id: UserFixtures.stored.all.length + 1,
        email: UserFixtures.account.create.email,
        role: UserFixtures.account.create.role,
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
        id: UserFixtures.stored.all.length + 1,
        email: UserFixtures.account.create.email,
        role: UserFixtures.account.create.role,
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
