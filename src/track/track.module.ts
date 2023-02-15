import { Global, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Global()
@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
