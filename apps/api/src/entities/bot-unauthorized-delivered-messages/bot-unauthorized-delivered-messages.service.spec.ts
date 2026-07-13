import { Test, TestingModule } from '@nestjs/testing';
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';
import { DatabaseModule } from '../../database.module';
import { BotUnauthorizedDeliveredMessagesRepository } from './bot-unauthorized-delivered-messages.repository';

describe('BotUnauthorizedDeliveredMessagesService', () => {
  let service: BotUnauthorizedDeliveredMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        BotUnauthorizedDeliveredMessagesService,
        BotUnauthorizedDeliveredMessagesRepository,
      ],
    }).compile();

    service = module.get<BotUnauthorizedDeliveredMessagesService>(
      BotUnauthorizedDeliveredMessagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
