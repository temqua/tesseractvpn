import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { DeactivateUnpaidJob } from './deactivate_unpaid';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { DeliveredMessagesModule } from '../users/delivered-messages/delivered-messages.module';
import { ShowUnpaidJob } from './show_unpaid';
import { NotifyUnpaidJob } from './notify_unpaid';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [JobsController],
  imports: [TelegramModule, DeliveredMessagesModule, UsersModule],
  providers: [JobsService, DeactivateUnpaidJob, ShowUnpaidJob, NotifyUnpaidJob],
})
export class JobsModule {}
