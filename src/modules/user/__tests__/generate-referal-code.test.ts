import request from 'supertest';
import { Role } from '@prisma/client';

import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('PUT /user/generate-referal-code/:id', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });
  const coach = UserFixtures.generate({ id: 2, role: Role.COACH });
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
    return request(app.getHttpServer()).put('/user/generate-referal-code').set('Cookie', [coachCookie]).send().expect(200);
  });
});
