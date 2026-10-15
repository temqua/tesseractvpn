import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { DatabaseModule } from '../../database.module';
import { UsersModule } from '../users/users.module';
import { PlansModule } from '../plans/plans.module';
import { TelegramModule } from '../telegram/telegram.module';
import { NalogModule } from '../nalog/nalog.module';
import { RemnawaveModule } from '../remnawave/remnawave.module';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PlansModule,
        DatabaseModule,
        TelegramModule,
        NalogModule,
        RemnawaveModule,
      ],
      providers: [PaymentsService, PaymentsRepository],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
