import { Test } from '@nestjs/testing';
import { generatePrismock } from 'prismock';

import { configure } from '../../src/server';
import { AppModule, PrismaService } from '../../src/modules';

export class AppFixtures {
  static async createApplication() {
    const prisMock = await generatePrismock();
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
