import request from 'supertest';

import { AppFixtures, ExerciseFixture, ITestApplication } from '../../../../testing/fixtures';
/* import { ExerciseToCreateDTO } from '../dto'; */

describe('POST /exercise', () => {
  let app: ITestApplication;

  const exercise = ExerciseFixture.generate({ id: 1 });

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    // cookie = await UserFixtures.generateAccessCookie(app, UserFixtures.stored.admin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create an exercise', async () => {
    return request(app.getHttpServer())
      .post('/exercise')
      .send(exercise)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(exercise);
      });
  });
});
