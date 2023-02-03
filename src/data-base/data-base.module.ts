import { Global, Module } from '@nestjs/common';
import { DataBaseService } from './data-base.service';

@Global()
@Module({
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DataBaseModule {}
