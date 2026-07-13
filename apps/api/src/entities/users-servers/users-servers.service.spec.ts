import { Test, TestingModule } from '@nestjs/testing';
import { UsersServersService } from './users-servers.service';
import { DatabaseModule } from '../../database.module';
import { UsersServersRepository } from './users-servers.repository';

describe('UsersServersService', () => {
  let service: UsersServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersServersService, UsersServersRepository],
      imports: [DatabaseModule],
    }).compile();

    service = module.get<UsersServersService>(UsersServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
