import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

import { PrismaService } from '../../../modules/common';
import { AppFixtures } from '../../../../testing/fixtures';
import { UserToRegisterDTO } from '../dto';
import { PublicUserModel } from '../type';

import { SuperTestResponse } from './types';

describe('POST /register', () => {
  let app: INestApplication;
  const userToRegister: UserToRegisterDTO = {
    email: 'aurel@gmail.com',
    password: 'testpassword',
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
      response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userToRegister)
        .expect(201);
    });

    it('Should create a user', () => {
      return expect(response.body).toEqual({
        id: 1,
        email: 'aurel@gmail.com',
        role: Role.USER,
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
        id: 1,
        email: 'aurel@gmail.com',
        role: Role.USER,
      });
    });
  });

  it('Should return an error if email is missing', () => {
    const { email, ...payload } = userToRegister;
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(400);
  });

  it('Should return an error if password is missing', () => {
    const { password, ...payload } = userToRegister;
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(400);
  });
});
