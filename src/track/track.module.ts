import { Global, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
import { AlbumService } from 'src/album/album.service';

@Global()
@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
  imports: [PrismaModule],
})
export class TrackModule {}
