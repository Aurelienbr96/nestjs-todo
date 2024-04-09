import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('DELETE /users', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });
  const userAdmin = UserFixtures.generate({ id: 2, role: Role.ADMIN });
  const secondUser = UserFixtures.generate({ id: 3 });

  let cookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user, userAdmin, secondUser] });
    cookie = await app.generateAccessCookie(user.id);
    adminCookie = await app.generateAccessCookie(userAdmin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('delete a user', () => {
    return request(app.getHttpServer())
      .delete('/user/1')
      .set('Cookie', [cookie])
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          id: user.id,
          email: user.email,
        });
      });
  });

  it('delete another user if admin', () => {
    return request(app.getHttpServer())
      .delete('/user/3')
      .set('Cookie', [adminCookie])
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          email: secondUser.email,
          id: secondUser.id,
        });
      });
  });

  it('Should not allow an update of another user if not admin', () => {
    return request(app.getHttpServer())
      .delete('/user/3')
      .set('Cookie', [cookie])
      .send()
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual('Forbidden resource');
      });
  });
});
