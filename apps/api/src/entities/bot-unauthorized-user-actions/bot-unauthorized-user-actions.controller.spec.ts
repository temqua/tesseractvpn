import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedUserActionsController } from './bot-unauthorized-user-actions.controller';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';
import { BotUnauthorizedUserActionsRepository } from './bot-unauthorized-user-actions.repository';
import { DatabaseModule } from '../../database.module';

describe('BotUnauthorizedUserActionsController', () => {
  let controller: BotUnauthorizedUserActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotUnauthorizedUserActionsController],
      imports: [DatabaseModule],

      providers: [
        BotUnauthorizedUserActionsService,
        BotUnauthorizedUserActionsRepository,
      ],
    }).compile();

    controller = module.get<BotUnauthorizedUserActionsController>(
      BotUnauthorizedUserActionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
