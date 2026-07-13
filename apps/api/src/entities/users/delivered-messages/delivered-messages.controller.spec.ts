import { Test, TestingModule } from '@nestjs/testing';
import { DeliveredMessagesController } from './delivered-messages.controller';
import { DeliveredMessagesService } from './delivered-messages.service';
import { DeliveredMessagesRepository } from './delivered-messages.repository';
import { DatabaseModule } from '../../../database.module';
import { UserExistsPipe } from '../user-exists-pipe';
import { UsersModule } from '../users.module';

describe('DeliveredMessagesController', () => {
  let controller: DeliveredMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveredMessagesController],
      imports: [DatabaseModule, UsersModule],

      providers: [
        DeliveredMessagesService,
        DeliveredMessagesRepository,
        UserExistsPipe,
      ],
    }).compile();

    controller = module.get<DeliveredMessagesController>(
      DeliveredMessagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
