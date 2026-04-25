import { Module } from '@nestjs/common';
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';
import { BotUnauthorizedDeliveredMessagesController } from './bot-unauthorized-delivered-messages.controller';
import { BotUnauthorizedDeliveredMessagesRepository } from './bot-unauthorized-delivered-messages.repository';

@Module({
  controllers: [BotUnauthorizedDeliveredMessagesController],
  providers: [
    BotUnauthorizedDeliveredMessagesService,
    BotUnauthorizedDeliveredMessagesRepository,
  ],
})
export class BotUnauthorizedDeliveredMessagesModule {}
