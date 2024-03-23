import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: '.env',
    });
  }

  public get(key: string) {
    return process.env[key] as string;
  }

  public getNumber(key: string) {
    return parseInt(this.get(key));
  }
}
