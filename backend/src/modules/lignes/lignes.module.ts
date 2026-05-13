import { Module } from '@nestjs/common';
import { LignesService } from './lignes.service';
import { LignesController } from './lignes.controller';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LignesController],
  providers: [LignesService],
  exports: [LignesService],
})
export class LignesModule {}
