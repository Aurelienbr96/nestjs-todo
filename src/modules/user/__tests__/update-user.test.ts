import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('PUT /users', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });
  const userAdmin = UserFixtures.generate({ id: 2, role: Role.ADMIN });

  let cookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user, userAdmin] });
    cookie = await app.generateAccessCookie(user.id);
    adminCookie = await app.generateAccessCookie(userAdmin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should update email', () => {
    const updatedEmail = 'test-email@gmail.com';
    return request(app.getHttpServer())
      .put('/user/1')
      .set('Cookie', [cookie])
      .send({
        email: updatedEmail,
        role: user.role,
        password: user.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          email: updatedEmail,
          googleId: user.googleId,
          id: user.id,
          refresh: user.refresh,
          role: user.role,
          referalCode: null,
        });
      });
  });

  it('Should update if the user is an admin', () => {
    const updatedEmail = 'test-email@gmail.com';
    return request(app.getHttpServer())
      .put('/user/1')
      .set('Cookie', [adminCookie])
      .send({
        email: updatedEmail,
        role: user.role,
        password: user.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          email: updatedEmail,
          googleId: user.googleId,
          id: user.id,
          refresh: user.refresh,
          role: user.role,
          referalCode: null,
        });
      });
  });

  it('Should not allow an update of another user if not admin', () => {
    const updatedEmail = 'test-email@gmail.com';
    return request(app.getHttpServer())
      .put('/user/2')
      .set('Cookie', [cookie])
      .send({
        email: updatedEmail,
      })
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual('Forbidden resource');
      });
  });
});
