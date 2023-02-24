import { Global, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Global()
@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
  imports: [PrismaModule, FavoriteModule],
})
export class ArtistModule {}
