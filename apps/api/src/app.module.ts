import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './entities/auth/auth.module';
import { BotIncomingMessagesModule } from './entities/bot-incoming-messages/bot-incoming-messages.module';
import { BotUnauthorizedDeliveredMessagesModule } from './entities/bot-unauthorized-delivered-messages/bot-unauthorized-delivered-messages.module';
import { BotUnauthorizedUserActionsModule } from './entities/bot-unauthorized-user-actions/bot-unauthorized-user-actions.module';
import { ExpensesModule } from './entities/expenses/expenses.module';
import { PaymentsModule } from './entities/payments/payments.module';
import { PlansModule } from './entities/plans/plans.module';
import { ServersModule } from './entities/servers/servers.module';
import { UsersServersModule } from './entities/users-servers/users-servers.module';
import { DeliveredMessagesModule } from './entities/users/delivered-messages/delivered-messages.module';
import { UsersActionsModule } from './entities/users/users-actions/users-actions.module';
import { UsersModule } from './entities/users/users.module';
import { LogHttpExceptionFilter } from './log-exceptions-filter';
import { JobsModule } from './entities/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from './entities/telegram/telegram.module';
import { DatabaseModule } from './database.module';
import { BotDeliveredMessagesModule } from './entities/bot-delivered-messages/bot-delivered-messages.module';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    ExpensesModule,
    PlansModule,
    ServersModule,
    UsersServersModule,
    UsersActionsModule,
    DeliveredMessagesModule,
    BotIncomingMessagesModule,
    AuthModule,
    BotUnauthorizedUserActionsModule,
    BotUnauthorizedDeliveredMessagesModule,
    JobsModule,
    TelegramModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    BotDeliveredMessagesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LogHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
