import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { MuscleGroupFixtures } from '../../../../testing/fixtures/muscle-group.fixtures';
import { AppFixtures } from '../../../../testing/fixtures';
import { MuscleToCreateDTO } from '../dto/muscle-to-create.dto';

describe('/muscle-group', () => {
  let app: INestApplication;
  const muscleGroupToCreate: MuscleToCreateDTO = {
    name: MuscleGroupFixtures.muscleGroup.create.name,
    description: MuscleGroupFixtures.muscleGroup.create.description as string,
  };

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /muscle-group', () => {
    it('Should create a muscle group', async () => {
      return request(app.getHttpServer())
        .post('/muscle-group')
        .send(muscleGroupToCreate)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: MuscleGroupFixtures.stored.muscleGroup.id,
            name: MuscleGroupFixtures.stored.muscleGroup.name,
            description: MuscleGroupFixtures.stored.muscleGroup.description,
          });
        });
    });
  });

  describe('GET /muscle-group', () => {
    it('Should find all muscle group', () => {
      return request(app.getHttpServer())
        .get('/muscle-group')
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(MuscleGroupFixtures.stored.all);
        });
    });

    describe('get one', () => {
      it('Should find a unique muscle group', () => {
        return request(app.getHttpServer())
          .get('/muscle-group/1')
          .send()
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(
              MuscleGroupFixtures.stored.muscleGroup,
            );
          });
      });

      it('Should throw an error if the ID does not exist', () => {
        const unexistingId = 400;
        return request(app.getHttpServer())
          .get(`/muscle-group/${unexistingId}`)
          .send()
          .expect(404)
          .then((response) => {
            expect(response.body.message).toEqual(
              `the muscle group for id:${unexistingId} has not been found`,
            );
          });
      });
    });
  });

  describe('PUT /muscle-group', () => {
    it('Should update a unique muscle group', () => {
      return request(app.getHttpServer())
        .put('/muscle-group/1')
        .send({
          name: MuscleGroupFixtures.updateName.name,
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            ...MuscleGroupFixtures.stored.muscleGroup,
            name: MuscleGroupFixtures.updateName.name,
          });
        });
    });

    it('Should display an error if other params are given', () => {
      return request(app.getHttpServer())
        .put('/muscle-group/1')
        .send(MuscleGroupFixtures.updateNameWithWrongParams.muscleGroup)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual([
            `property ${
              Object.keys(
                MuscleGroupFixtures.updateNameWithWrongParams.muscleGroup,
              )[1]
            } should not exist`,
          ]);
        });
    });

    it('Should throw an error if the ID does not exist', () => {
      const unexistingId = 400;
      return request(app.getHttpServer())
        .put(`/muscle-group/${unexistingId}`)
        .send({ name: MuscleGroupFixtures.updateName.name })
        .expect(404)
        .then((response) => {
          expect(response.body.message).toEqual(
            `the muscle group for id:${unexistingId} has not been found`,
          );
        });
    });
  });

  describe('DELETE /muscle-group', () => {
    it('Should delete an existing resource', () => {
      return request(app.getHttpServer())
        .delete(`/muscle-group/1`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            ...MuscleGroupFixtures.stored.muscleGroup,
            name: MuscleGroupFixtures.updateName.name,
          });
        });
    });

    it('Should delete multiple existing resource', async () => {
      await request(app.getHttpServer())
        .post('/muscle-group')
        .send(muscleGroupToCreate)
        .expect(201);

      await request(app.getHttpServer())
        .post('/muscle-group')
        .send(muscleGroupToCreate)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/muscle-group`)
        .send({ ids: [2, 3] })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            count: 2,
          });
        });
    });
  });
});
