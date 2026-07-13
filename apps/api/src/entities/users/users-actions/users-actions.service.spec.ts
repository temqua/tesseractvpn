import { Test, TestingModule } from '@nestjs/testing';
import { UsersActionsService } from './users-actions.service';
import { DatabaseModule } from '../../../database.module';
import { UsersModule } from '../users.module';
import { UsersActionsRepository } from './users-actions.repository';
import { UserExistsPipe } from '../user-exists-pipe';

describe('UsersActionsService', () => {
  let service: UsersActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DatabaseModule],
      providers: [UsersActionsService, UsersActionsRepository, UserExistsPipe],
    }).compile();

    service = module.get<UsersActionsService>(UsersActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
