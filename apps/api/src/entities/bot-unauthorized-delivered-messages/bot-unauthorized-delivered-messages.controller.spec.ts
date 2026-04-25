import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedDeliveredMessagesController } from './bot-unauthorized-delivered-messages.controller';
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';

describe('BotUnauthorizedDeliveredMessagesController', () => {
  let controller: BotUnauthorizedDeliveredMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotUnauthorizedDeliveredMessagesController],
      providers: [BotUnauthorizedDeliveredMessagesService],
    }).compile();

    controller = module.get<BotUnauthorizedDeliveredMessagesController>(
      BotUnauthorizedDeliveredMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
