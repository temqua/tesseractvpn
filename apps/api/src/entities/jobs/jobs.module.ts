import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { DeactivateUnpaidJob } from './deactivate_unpaid';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { DeliveredMessagesModule } from '../users/delivered-messages/delivered-messages.module';

@Module({
  controllers: [JobsController],
  imports: [TelegramModule, DeliveredMessagesModule],
  providers: [JobsService, DeactivateUnpaidJob],
})
export class JobsModule {}
