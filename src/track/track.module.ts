import { Global, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Global()
@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
  imports: [PrismaModule, FavoriteModule],
})
export class TrackModule {}
