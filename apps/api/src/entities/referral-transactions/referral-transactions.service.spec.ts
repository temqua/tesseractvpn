import { Test, TestingModule } from '@nestjs/testing';
import { ReferralTransactionsService } from './referral-transactions.service';
import { ReferralTransactionsRepository } from './referral-transactions.repository';
import { DatabaseModule } from '../../database.module';

describe('ReferralTransactionsService', () => {
  let service: ReferralTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferralTransactionsService, ReferralTransactionsRepository],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<ReferralTransactionsService>(
      ReferralTransactionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
