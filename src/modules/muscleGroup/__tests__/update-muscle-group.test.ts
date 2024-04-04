import request from 'supertest';
import { Role } from '@prisma/client';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('PUT /muscle-group', () => {
  let app: ITestApplication;

  const muscle = MuscleGroupFixtures.generate({ id: 1, name: 'Back' });
  const user = UserFixtures.generate({ id: 1, role: Role.ADMIN });
  const muscleGroupWithWrongParams = { name: 'Shoulder', otherParams: 'string' };

  let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ muscleGroups: [muscle], users: [user] });
    cookie = await app.generateAccessCookie(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should update a unique muscle group', () => {
    const updatedName = 'Legs';
    return request(app.getHttpServer())
      .put('/muscle-group/1')
      .set('Cookie', [cookie])
      .send({
        name: updatedName,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          ...muscle,
          name: updatedName,
        });
      });
  });

  it('Should display an error if other params are given', () => {
    return request(app.getHttpServer())
      .put('/muscle-group/1')
      .set('Cookie', [cookie])
      .send(muscleGroupWithWrongParams)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual([`property ${Object.keys(muscleGroupWithWrongParams)[1]} should not exist`]);
      });
  });

  it('Should throw an error if the ID does not exist', () => {
    const unexistingId = 400;
    return request(app.getHttpServer())
      .put(`/muscle-group/${unexistingId}`)
      .set('Cookie', [cookie])
      .send({ name: muscle.name })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual(`the muscle group for id:${unexistingId} has not been found`);
      });
  });
});
