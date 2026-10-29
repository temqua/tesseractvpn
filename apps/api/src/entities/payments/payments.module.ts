import { Module } from '@nestjs/common';
import { NalogModule } from '../nalog/nalog.module';
import { PlansModule } from '../plans/plans.module';
import { RemnawaveModule } from '../remnawave/remnawave.module';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { UserPaymentsController } from './payments.user.controller';
import { YookassaClient } from './yookassa.client';

@Module({
  controllers: [PaymentsController, UserPaymentsController],
  providers: [PaymentsService, PaymentsRepository, YookassaClient],
  exports: [PaymentsService],
  imports: [
    UsersModule,
    PlansModule,
    TelegramModule,
    NalogModule,
    RemnawaveModule,
  ],
})
export class PaymentsModule {}
