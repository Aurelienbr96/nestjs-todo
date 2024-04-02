// import request from 'supertest';

import { AppFixtures, ITestApplication } from '../../../../testing/fixtures';

describe('DELETE /exercise', () => {
  let app: ITestApplication;

  beforeAll(async () => {
    app = await AppFixtures.createApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  /* describe('DELETE /exercise', () => {
    it('Should delete an existing resource', () => {});

    it('Should delete multiple existing resource', async () => {});
  }); */
});
