import request from 'supertest';
import { Role } from '@prisma/client';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('DELETE /muscle-group', () => {
  let app: ITestApplication;

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const user = UserFixtures.generate({ id: 1, role: Role.ADMIN });
  const { id } = muscle;
  let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ muscleGroups: [muscle, muscle, muscle], users: [user] });
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
          expect(response.body).toEqual(muscle);
        });
    });

    it('Should delete multiple existing resource', async () => {
      return request(app.getHttpServer())
        .delete(`/muscle-group`)
        .set('Cookie', [cookie])
        .send({ ids: [1, 2] })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            count: 2,
          });
        });
    });
  });
});
