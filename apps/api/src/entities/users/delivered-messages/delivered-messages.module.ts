import { Module } from '@nestjs/common';
import { UserExistsPipe } from '../user-exists-pipe';
import { UsersModule } from '../users.module';
import { DeliveredMessagesController } from './delivered-messages.controller';
import { DeliveredMessagesRepository } from './delivered-messages.repository';
import { DeliveredMessagesService } from './delivered-messages.service';

@Module({
  controllers: [DeliveredMessagesController],
  imports: [UsersModule],
  providers: [
    DeliveredMessagesService,
    DeliveredMessagesRepository,
    UserExistsPipe,
  ],
})
export class DeliveredMessagesModule {}
