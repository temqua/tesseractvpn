import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { UserPaymentsController } from './payments.user.controller';

@Module({
  controllers: [PaymentsController, UserPaymentsController],
  providers: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
