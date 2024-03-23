import { Response } from 'supertest';

export interface SuperTestResponse<T = any> extends Response {
  body: T;
}
