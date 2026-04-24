import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';

describe('BotUnauthorizedUserActionsService', () => {
  let service: BotUnauthorizedUserActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotUnauthorizedUserActionsService],
    }).compile();

    service = module.get<BotUnauthorizedUserActionsService>(
      BotUnauthorizedUserActionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
