import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackService } from '../track/track.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [PrismaModule]
})
export class ArtistModule {}
