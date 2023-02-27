import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DataBaseModule } from './data-base/data-base.module';
import { HelpersService } from './helpers/helpers.service';
import { HelpersModule } from './helpers/helpers.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoriteModule } from './favorite/favorite.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerModule } from './logger/custom-logger.module';
import { RequestLoggingMiddleware } from './request-logging/request-logging.middleware';

@Module({
  imports: [
    UserModule,
    DataBaseModule,
    HelpersModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoriteModule,
    PrismaModule,
    AuthModule,
    CustomLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelpersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
