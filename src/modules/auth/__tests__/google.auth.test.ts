import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
import { GoogleAuthDTO } from '../dto/google-auth.dto';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test'),
}));

describe('POST auth/google', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1, role: Role.ADMIN, email: 'test@gmail.com' });
  // const coachUser = UserFixtures.generate({ id: 2, role: Role.ADMIN, email: 'test@gmail.com' });

  const userToRegister: GoogleAuthDTO = {
    googleCredential: {
      credential: 'test123',
      clientId: 'test123',
      select_by: 'test123',
    },
    state: {
      role: user.role,
    },
  };

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should not register an user without state params', async () => {
    return await request(app.getHttpServer())
      .post('/auth/google')
      .send({ googleCredential: userToRegister.googleCredential })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('app.page.login.error.not_registered');
      });
  });

  it('should create a user account', async () => {
    return await request(app.getHttpServer())
      .post('/auth/google')
      .send(userToRegister)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({ ...user, password: null, refresh: null, referalCode: null, googleId: 'test' });
      });
  });

  it('should log in a user account', async () => {
    return await request(app.getHttpServer())
      .post('/auth/google')
      .send(userToRegister)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({ ...user, password: null, refresh: 'test', referalCode: null, googleId: 'test' });
      });
  });
});
