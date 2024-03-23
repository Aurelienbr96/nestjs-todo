import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from '../modules';

export function setUpSwagger(app: INestApplication) {
  const config = app.get(ConfigService);

  if (['development', 'staging'].includes(config.get('NODE_ENV'))) {
    const builder = new DocumentBuilder().setTitle('API').build();
    const document = SwaggerModule.createDocument(app, builder);
    SwaggerModule.setup('docs', app, document);
  }
}
