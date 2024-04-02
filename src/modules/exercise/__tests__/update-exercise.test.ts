// import request from 'supertest';

import { AppFixtures, /*  ExerciseFixture, */ ITestApplication } from '../../../../testing/fixtures';
// import { ExerciseToCreateDTO } from '../dto';

describe('PUT /exercise', () => {
  let app: ITestApplication;

  /*  const exerciseToCreate: ExerciseToCreateDTO = {
    name: ExerciseFixture.exercise.create.name,
    description: ExerciseFixture.exercise.create.description as string,
    userId: 5,
    muscleGroupIds: [5],
  }; */
  // let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    // cookie = await UserFixtures.generateAccessCookie(app, UserFixtures.stored.admin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should display an error if other params are given', () => {});

  it('Should throw an error if the ID does not exist', () => {});
});
