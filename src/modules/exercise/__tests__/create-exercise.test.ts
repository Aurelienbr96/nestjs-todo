import request from 'supertest';

import {
  AppFixtures,
  ExerciseFixture,
  ITestApplication,
  UserFixtures,
  MuscleGroupFixtures,
} from '../../../../testing/fixtures';
/* import { ExerciseToCreateDTO } from '../dto'; */

describe('POST /exercise', () => {
  let app: ITestApplication;

  const muscle = MuscleGroupFixtures.generate({ id: 1 });
  const user = UserFixtures.generate({ id: 1 });
  const exercise = ExerciseFixture.generate({ id: 1, userId: user.id, muscleGroupIds: [muscle.id] });

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    await app.load({ users: [user], muscleGroups: [muscle] });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create an exercise', async () => {
    const { id, ...exerciseToCreate } = exercise;

    const { muscleGroupIds, ...createdExercise } = exercise;

    return request(app.getHttpServer())
      .post('/exercise')
      .send({ ...exerciseToCreate, muscleGroupIds: [1] })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          ...createdExercise,
          id: exercise.id,
          muscleGroups: [
            {
              muscleGroup: {
                id: muscle.id,
              },
            },
          ],
        });
      });
  });

  it('Should throw an error when trying to create an exercise with non existing muscle group ids', async () => {
    const { id, ...exerciseToCreate } = exercise;

    return request(app.getHttpServer())
      .post('/exercise')
      .send({ ...exerciseToCreate, muscleGroupIds: [500] })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Tried to create an exercise with non existing muscles groups');
      });
  });

  it('Should throw an error when trying to create an exercise with bad parameters', async () => {
    const { id, ...exerciseToCreate } = exercise;

    return request(app.getHttpServer())
      .post('/exercise')
      .send({ ...exerciseToCreate, badParam: 'this is not right' })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(['property badParam should not exist']);
      });
  });
});
