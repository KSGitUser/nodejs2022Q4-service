import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackService } from '../track/track.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [TrackService],
})
export class ArtistModule {}
