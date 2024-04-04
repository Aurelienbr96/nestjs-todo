import request from 'supertest';

import {
  AppFixtures,
  ExerciseFixture,
  ITestApplication,
  MuscleGroupFixtures,
  UserFixtures,
} from '../../../../testing/fixtures';

describe('GET /exercise', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const exercise = ExerciseFixture.generate({ id: 1, userId: user.id, muscleGroupIds: [muscle.id] });
  const { muscleGroupIds, ...exerciseWithoutMuscleGroupIds } = exercise;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    const { muscleGroupIds, ...rest } = exercise;
    await app.load({
      users: [user],
      muscleGroups: [muscle],
      exercises: [rest],
      exerciseMuscleGroup: [{ exerciseId: exercise.id, muscleGroupId: muscle.id }],
    });
    // cookie = await UserFixtures.generateAccessCookie(app, UserFixtures.stored.admin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should find all exercise', () => {
    return request(app.getHttpServer())
      .get('/exercise?page=1')
      .send()
      .expect(200)
      .then((response) => {
        const { exercises, pages } = response.body;

        expect(exercises.length).toBe(1);
        expect(pages).toBe(1);
        expect(exercises).toEqual([{ ...exerciseWithoutMuscleGroupIds, muscleGroups: [muscle.id] }]);
      });
  });

  describe('get one', () => {
    it('Should find a unique exercise', () => {
      return request(app.getHttpServer())
        .get(`/exercise/${exercise.id}`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ ...exerciseWithoutMuscleGroupIds, muscleGroups: [muscle.id] });
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
