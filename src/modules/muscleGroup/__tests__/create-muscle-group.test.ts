import request from 'supertest';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';

describe('POST /muscle-group', () => {
  let app: ITestApplication;

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const user = UserFixtures.generate({ id: 1 });
  const { id, ...muscleGroupToCreate } = muscle;
  let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user] });
    cookie = await app.generateAccessCookie(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /muscle-group', () => {
    it('Should create a muscle group', async () => {
      return request(app.getHttpServer())
        .post('/muscle-group')
        .set('Cookie', [cookie])
        .send(muscleGroupToCreate)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: muscle.id,
            name: muscleGroupToCreate.name,
            description: muscleGroupToCreate.description,
          });
        });
    });
  });
});
