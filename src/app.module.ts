import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DataBaseModule } from './data-base/data-base.module';
import { HelpersService } from './helpers/helpers.service';
import { HelpersModule } from './helpers/helpers.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    UserModule,
    DataBaseModule,
    HelpersModule,
    ArtistModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelpersService],
})
export class AppModule {}
