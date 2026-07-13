import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';
import { BotUnauthorizedUserActionsRepository } from './bot-unauthorized-user-actions.repository';
import { DatabaseModule } from '../../database.module';

describe('BotUnauthorizedUserActionsService', () => {
  let service: BotUnauthorizedUserActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        BotUnauthorizedUserActionsService,
        BotUnauthorizedUserActionsRepository,
      ],
    }).compile();

    service = module.get<BotUnauthorizedUserActionsService>(
      BotUnauthorizedUserActionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
