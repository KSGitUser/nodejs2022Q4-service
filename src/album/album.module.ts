import { Global, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Global()
@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [PrismaModule, FavoriteModule],
})
export class AlbumModule {}
