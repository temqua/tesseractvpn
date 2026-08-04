import { Module } from '@nestjs/common';
import { ReferralTransactionsService } from './referral-transactions.service';
import { ReferralTransactionsController } from './referral-transactions.controller';
import { ReferralTransactionsRepository } from './referral-transactions.repository';

@Module({
  controllers: [ReferralTransactionsController],
  providers: [ReferralTransactionsService, ReferralTransactionsRepository],
})
export class ReferralTransactionsModule {}
