import { Module } from '@nestjs/common';
import { NalogService } from './nalog.service';

@Module({
  providers: [NalogService],
  exports: [NalogService],
})
export class NalogModule {}
