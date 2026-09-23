import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { DatabaseModule } from '../../database.module';
import { PaymentsRepository } from './payments.repository';
import { UsersModule } from '../users/users.module';
import { PlansModule } from '../plans/plans.module';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, PlansModule, DatabaseModule],
      controllers: [PaymentsController],
      providers: [PaymentsService, PaymentsRepository],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
