import { Module } from '@nestjs/common';
import { BotDeliveredMessagesService } from './bot-delivered-messages.service';
import { BotDeliveredMessagesController } from './bot-delivered-messages.controller';
import { BotDeliveredMessagesRepository } from './bot-delivered-messages.repository';

@Module({
  controllers: [BotDeliveredMessagesController],
  providers: [BotDeliveredMessagesService, BotDeliveredMessagesRepository],
})
export class BotDeliveredMessagesModule {}
