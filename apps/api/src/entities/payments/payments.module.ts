import { Module } from '@nestjs/common';
import { PlansModule } from '../plans/plans.module';
import { UsersModule } from '../users/users.module';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { UserPaymentsController } from './payments.user.controller';

@Module({
  controllers: [PaymentsController, UserPaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  imports: [UsersModule, PlansModule],
})
export class PaymentsModule {}
