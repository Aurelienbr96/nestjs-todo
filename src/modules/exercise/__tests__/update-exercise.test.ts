import request from 'supertest';

import { SuperTestResponse } from '../../../../testing/types';
import {
  AppFixtures,
  ExerciseFixture,
  /*  ExerciseFixture, */ ITestApplication,
  MuscleGroupFixtures,
  UserFixtures,
} from '../../../../testing/fixtures';
import { ExerciseWithMuscleGroups } from '../type/Exercise';
// import { ExerciseToCreateDTO } from '../dto';

describe('PUT /exercise', () => {
  let app: ITestApplication;

  const user = UserFixtures.generate({ id: 1 });

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const exercise = ExerciseFixture.generate({ id: 1, userId: user.id, muscleGroupIds: [muscle.id] });
  const { id } = exercise;

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

  it('Should update an exercise', () => {
    const updatedNamed = 'new name';
    const { muscleGroupIds, ...exerciseWithoutMuscleGroupIdsKey } = exercise;
    return request(app.getHttpServer())
      .put(`/exercise/${id}`)
      .send({ ...exercise, name: updatedNamed })
      .expect(200)
      .then((response: SuperTestResponse<ExerciseWithMuscleGroups>) => {
        expect(response.body).toEqual({
          ...exerciseWithoutMuscleGroupIdsKey,
          muscleGroups: muscleGroupIds,
          name: updatedNamed,
        });
      });
  });

  it('Should throw an error if the ID does not exist', () => {
    const unexistingId = 500;
    return request(app.getHttpServer())
      .put(`/exercise/${unexistingId}`)
      .send(exercise)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(`Exercise ID ${unexistingId} have not been found`);
      });
  });

  it('Should throw an error if I give the request wrong params', () => {
    const unexistingId = 500;
    return request(app.getHttpServer())
      .put(`/exercise/${unexistingId}`)
      .send({ ...exercise, wrongParam: 'name' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(['property wrongParam should not exist']);
      });
  });
});
