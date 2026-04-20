import { Module } from '@nestjs/common';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';
import { BotIncomingMessagesController } from './bot-incoming-messages.controller';
import { BotIncomingMessagesRepository } from './bot-incoming-messages.repository';

@Module({
  controllers: [BotIncomingMessagesController],
  providers: [BotIncomingMessagesService, BotIncomingMessagesRepository],
})
export class BotIncomingMessagesModule {}
