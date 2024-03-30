import request from 'supertest';

import { AppFixtures, ExerciseFixture, ITestApplication } from '../../../../testing/fixtures';
import { ExerciseToCreateDTO } from '../dto';

describe('/exercise', () => {
  let app: ITestApplication;

  const exerciseToCreate: ExerciseToCreateDTO = {
    name: ExerciseFixture.exercise.create.name,
    description: ExerciseFixture.exercise.create.description as string,
    userId: 5,
    muscleGroupIds: [5],
  };
  // let cookie: string;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
    // cookie = await UserFixtures.generateAccessCookie(app, UserFixtures.stored.admin.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /exercise', () => {
    it('Should create an exercise', async () => {
      return request(app.getHttpServer())
        .post('/exercise')
        .send(exerciseToCreate)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(ExerciseFixture.stored.exercise);
        });
    });
  });

  describe('GET /exercise', () => {
    it('Should find all exercise', () => {
      return request(app.getHttpServer())
        .get('/exercise')
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(ExerciseFixture.stored.all);
        });
    });

    describe('get one', () => {
      it('Should find a unique exercise', () => {
        return request(app.getHttpServer())
          .get(`/exercise/${ExerciseFixture.stored.exercise.id}`)
          .send()
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(ExerciseFixture.stored.all);
          });
      });

      it('Should throw an error if the exercise does not exist', async () => {
        const unexistingId = 400;
        await request(app.getHttpServer())
          .get(`/exercise/${unexistingId}`)
          .send()
          .expect(200)
          .then((response): any => {
            console.log('response', response);
            expect(response.body).toEqual(4);
          });
      });
    });
  });

  describe('PUT /exercise', () => {
    it('Should display an error if other params are given', () => {});

    it('Should throw an error if the ID does not exist', () => {});
  });

  describe('DELETE /exercise', () => {
    it('Should delete an existing resource', () => {});

    it('Should delete multiple existing resource', async () => {});
  });
});
