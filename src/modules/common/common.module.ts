import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [PrismaService, ConfigService],
  exports: [PrismaService, ConfigService],
})
export class CommonModule {}
