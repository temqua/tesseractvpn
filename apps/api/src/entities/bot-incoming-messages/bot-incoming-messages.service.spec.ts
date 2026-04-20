import { Test, TestingModule } from '@nestjs/testing';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';

describe('BotIncomingMessagesService', () => {
  let service: BotIncomingMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotIncomingMessagesService],
    }).compile();

    service = module.get<BotIncomingMessagesService>(
      BotIncomingMessagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
