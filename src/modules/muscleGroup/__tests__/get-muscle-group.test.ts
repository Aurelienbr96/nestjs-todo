import request from 'supertest';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures, ITestApplication, UserFixtures } from '../../../../testing/fixtures';
// import { MuscleToCreateDTO } from '../dto/muscle-to-create.dto';

describe('GET /muscle-group', () => {
  let app: ITestApplication;

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const user = UserFixtures.generate({ id: 1 });

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ muscleGroups: [muscle], users: [user] });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should find all muscle group', () => {
    return request(app.getHttpServer())
      .get('/muscle-group')
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([muscle]);
      });
  });

  describe('get one', () => {
    it('Should find a unique muscle group', () => {
      return request(app.getHttpServer())
        .get('/muscle-group/1')
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(muscle);
        });
    });

    it('Should throw an error if the ID does not exist', () => {
      const unexistingId = 400;
      return request(app.getHttpServer())
        .get(`/muscle-group/${unexistingId}`)
        .send()
        .expect(404)
        .then((response) => {
          expect(response.body.message).toEqual(`the muscle group for id:${unexistingId} has not been found`);
        });
    });
  });
});
