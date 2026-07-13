import { Test, TestingModule } from '@nestjs/testing';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';
import { BotIncomingMessagesRepository } from './bot-incoming-messages.repository';
import { DatabaseModule } from '../../database.module';

describe('BotIncomingMessagesService', () => {
  let service: BotIncomingMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [BotIncomingMessagesService, BotIncomingMessagesRepository],
    }).compile();

    service = module.get<BotIncomingMessagesService>(
      BotIncomingMessagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
