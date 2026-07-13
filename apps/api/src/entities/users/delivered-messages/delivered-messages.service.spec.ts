import { Test, TestingModule } from '@nestjs/testing';
import { DeliveredMessagesService } from './delivered-messages.service';
import { DeliveredMessagesRepository } from './delivered-messages.repository';
import { DatabaseModule } from '../../../database.module';
import { UserExistsPipe } from '../user-exists-pipe';
import { UsersModule } from '../users.module';

describe('DeliveredMessagesService', () => {
  let service: DeliveredMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsersModule],
      providers: [
        DeliveredMessagesService,
        DeliveredMessagesRepository,
        UserExistsPipe,
      ],
    }).compile();

    service = module.get<DeliveredMessagesService>(DeliveredMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
