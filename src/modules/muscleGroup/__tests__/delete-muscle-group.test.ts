import request from 'supertest';
import { Role } from '@prisma/client';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('DELETE /muscle-group', () => {
  let app: ITestApplication;

  const muscles = [
    MuscleGroupFixtures.generate({ id: 1 }),
    MuscleGroupFixtures.generate({ id: 2 }),
    MuscleGroupFixtures.generate({ id: 3 }),
  ];

  const user = UserFixtures.generate({ id: 1, role: Role.ADMIN });
  const { id } = muscles[0];
  let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ muscleGroups: muscles, users: [user] });
    cookie = await app.generateAccessCookie(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DELETE /muscle-group', () => {
    it('Should delete an existing resource', () => {
      return request(app.getHttpServer())
        .delete(`/muscle-group/${id}`)
        .set('Cookie', [cookie])
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(muscles[0]);
        });
    });

    it('Should delete multiple existing resource', async () => {
      return request(app.getHttpServer())
        .delete(`/muscle-group`)
        .set('Cookie', [cookie])
        .send({ ids: [muscles[1].id, muscles[2].id] })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            count: 2,
          });
        });
    });
  });
});
