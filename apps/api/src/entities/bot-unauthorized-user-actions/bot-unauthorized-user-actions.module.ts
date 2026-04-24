import { Module } from '@nestjs/common';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';
import { BotUnauthorizedUserActionsController } from './bot-unauthorized-user-actions.controller';
import { BotUnauthorizedUserActionsRepository } from './bot-unauthorized-user-actions.repository';

@Module({
  controllers: [BotUnauthorizedUserActionsController],
  providers: [
    BotUnauthorizedUserActionsService,
    BotUnauthorizedUserActionsRepository,
  ],
})
export class BotUnauthorizedUserActionsModule {}
