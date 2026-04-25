import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';

describe('BotUnauthorizedDeliveredMessagesService', () => {
  let service: BotUnauthorizedDeliveredMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotUnauthorizedDeliveredMessagesService],
    }).compile();

    service = module.get<BotUnauthorizedDeliveredMessagesService>(
      BotUnauthorizedDeliveredMessagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
