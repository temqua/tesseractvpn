import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database.module';
import { BotDeliveredMessagesController } from './bot-delivered-messages.controller';
import { BotDeliveredMessagesRepository } from './bot-delivered-messages.repository';
import { BotDeliveredMessagesService } from './bot-delivered-messages.service';

describe('BotDeliveredMessagesController', () => {
  let controller: BotDeliveredMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotDeliveredMessagesController],
      imports: [DatabaseModule],
      providers: [BotDeliveredMessagesService, BotDeliveredMessagesRepository],
    }).compile();

    controller = module.get<BotDeliveredMessagesController>(
      BotDeliveredMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
