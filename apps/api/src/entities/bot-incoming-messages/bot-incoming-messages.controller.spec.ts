import { Test, TestingModule } from '@nestjs/testing';
import { BotIncomingMessagesController } from './bot-incoming-messages.controller';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';

describe('BotIncomingMessagesController', () => {
  let controller: BotIncomingMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotIncomingMessagesController],
      providers: [BotIncomingMessagesService],
    }).compile();

    controller = module.get<BotIncomingMessagesController>(
      BotIncomingMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
