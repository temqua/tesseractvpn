import { Module } from '@nestjs/common';
import { TelegramJobsService } from './telegram.jobs.service';
import { TelegramBotService } from './telegram.bot.service';

@Module({
  providers: [TelegramJobsService, TelegramBotService],
  exports: [TelegramJobsService, TelegramBotService],
})
export class TelegramModule {}
