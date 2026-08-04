import { Test, TestingModule } from '@nestjs/testing';
import { ReferralTransactionsController } from './referral-transactions.controller';
import { ReferralTransactionsService } from './referral-transactions.service';
import { DatabaseModule } from '../../database.module';
import { ReferralTransactionsRepository } from './referral-transactions.repository';

describe('ReferralTransactionsController', () => {
  let controller: ReferralTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralTransactionsController],
      providers: [ReferralTransactionsService, ReferralTransactionsRepository],
      imports: [DatabaseModule],
    }).compile();

    controller = module.get<ReferralTransactionsController>(
      ReferralTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
