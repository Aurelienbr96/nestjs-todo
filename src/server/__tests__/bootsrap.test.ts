import { Post, Body, Controller, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsString } from 'class-validator';
import request from 'supertest';

import { configure } from '../bootstrap';

class MockDTO {
  @IsString()
  property!: string;
}

@Controller()
class MockController {
  @Post()
  mockRequest(@Body() requestDTO: MockDTO) {
    return requestDTO;
  }
}

describe('configure', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const fixtures = await Test.createTestingModule({
      controllers: [MockController],
    }).compile();
    app = fixtures.createNestApplication();
    configure(app);
    await app.init();
  });

  it('should return a success', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ property: 'content' })
      .expect(201);
  });
  it('should return an error with extra properties', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({ property: 'content', extra: true })
      .expect(400);
  });
});
