import request from 'supertest';

import {
  AppFixtures,
  ExerciseFixture,
  ITestApplication,
  MuscleGroupFixtures,
  UserFixtures,
} from '../../../../testing/fixtures';

describe('DELETE /exercise', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const exercise = ExerciseFixture.generate({ id: 1, userId: user.id, muscleGroupIds: [muscle.id] });
  const { id } = exercise;
  const { muscleGroupIds, ...exerciseWithoutMuscleGroup } = exercise;

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

  it('Should delete an existing resource', () => {
    return request(app.getHttpServer())
      .delete(`/exercise/${id}`)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(exerciseWithoutMuscleGroup);
      });
  });

  it('Should return an error if id does not exist', () => {
    const unexistingId = 500;
    return request(app.getHttpServer())
      .delete(`/exercise/${unexistingId}`)
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(`Exercise ID ${unexistingId} have not been found.`);
      });
  });
});
