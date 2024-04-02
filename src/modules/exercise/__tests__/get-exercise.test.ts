import request from 'supertest';

import {
  AppFixtures,
  ExerciseFixture,
  ITestApplication,
  MuscleGroupFixtures,
  UserFixtures,
} from '../../../../testing/fixtures';

// generate needs to create an exercise with a list of muscle group Ids (actually or not?)
// we need to do a transaction anyway

describe('GET /exercise', () => {
  let app: ITestApplication;

  const exercise = ExerciseFixture.generate({ id: 1 });
  const user = UserFixtures.generate({ id: 1 });
  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  // let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    const { muscleGroupIds, ...rest } = exercise;
    await app.load({ users: [user], muscleGroups: [muscle], exercises: [rest] });
    // cookie = await UserFixtures.generateAccessCookie(app, UserFixtures.stored.admin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should find all exercise', () => {
    // @TODO teddy bb chat renommage des propriété entre la requete post et ce que le serveur renvoie, bonne idée ?
    // const { muscleGroupIds, ...exerciseWithoutMuscleGroupIds } = exercise;
    return request(app.getHttpServer())
      .get('/exercise?page=1')
      .send()
      .expect(200)
      .then((response) => {
        const { exercises, pages } = response.body;

        expect(exercises.length).toBe(1);
        expect(pages).toBe(1);
        expect(exercises).toEqual([{ ...exercise, muscleGroups: [] }]);
      });
  });

  describe('get one', () => {
    it('Should find a unique exercise', () => {
      return request(app.getHttpServer())
        .get(`/exercise/${exercise.id}`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ ...exercise, muscleGroups: [] });
        });
    });

    it('Should throw an error if the exercise does not exist', async () => {
      const unexistingId = 400;
      await request(app.getHttpServer())
        .get(`/exercise/${unexistingId}`)
        .send()
        .expect(404)
        .then((response): any => {
          expect(response.body.message).toEqual('the exercise for id:400 has not been found');
        });
    });
  });
});
