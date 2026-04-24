import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedUserActionsController } from './bot-unauthorized-user-actions.controller';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';

describe('BotUnauthorizedUserActionsController', () => {
  let controller: BotUnauthorizedUserActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotUnauthorizedUserActionsController],
      providers: [BotUnauthorizedUserActionsService],
    }).compile();

    controller = module.get<BotUnauthorizedUserActionsController>(
      BotUnauthorizedUserActionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
