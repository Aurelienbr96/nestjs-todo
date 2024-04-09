import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('GET /users', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1, role: Role.ADMIN });
  let adminCookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user] });
    adminCookie = await app.generateAccessCookie(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should find all users', () => {
    const { password, googleId, ...fetchedUser } = user;
    return request(app.getHttpServer())
      .get('/user')
      .set('Cookie', [adminCookie])
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([fetchedUser]);
      });
  });
});
