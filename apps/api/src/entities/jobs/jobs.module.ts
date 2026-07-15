import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { DeactivateUnpaidJob } from './deactivate_unpaid';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  imports: [TelegramModule],
  providers: [JobsService, DeactivateUnpaidJob],
})
export class JobsModule {}
