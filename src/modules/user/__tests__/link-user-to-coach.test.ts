import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('POST /link-user-to-coach', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });
  const coach = UserFixtures.generate({ id: 2, role: Role.COACH, referalCode: 'my-unique-referal-code' });
  let coachCookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user, coach] });
    coachCookie = await app.generateAccessCookie(coach.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should link an user to a coach', () => {
    return request(app.getHttpServer())
      .post('/user/link-user-to-coach')
      .set('Cookie', [coachCookie])
      .send({
        referalCode: coach.referalCode,
        clientId: user.id,
      })
      .expect(201);
  });
});
