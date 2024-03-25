import { Test } from '@nestjs/testing';
import { generatePrismock } from 'prismock';

import { configure } from '../../src/server';
import { AppModule, PrismaService } from '../../src/modules';

import { UserFixtures } from './user.fixtures';

export class AppFixtures {
  static async createApplication() {
    const prisMock = await generatePrismock();
    await prisMock.user.createMany({ data: UserFixtures.stored.all });
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisMock)
      .compile();

    const app = moduleRef.createNestApplication();
    configure(app);
    await app.init();
    return app;
  }
}
