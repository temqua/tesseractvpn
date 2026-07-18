import { Test, TestingModule } from '@nestjs/testing';
import { BotDeliveredMessagesService } from './bot-delivered-messages.service';
import { DatabaseModule } from '../../database.module';
import { BotDeliveredMessagesRepository } from './bot-delivered-messages.repository';

describe('BotDeliveredMessagesService', () => {
  let service: BotDeliveredMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [BotDeliveredMessagesService, BotDeliveredMessagesRepository],
    }).compile();

    service = module.get<BotDeliveredMessagesService>(
      BotDeliveredMessagesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
