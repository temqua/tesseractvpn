import { Test, TestingModule } from '@nestjs/testing';
import { UsersServersController } from './users-servers.controller';
import { UsersServersService } from './users-servers.service';
import { DatabaseModule } from '../../database.module';
import { UsersServersRepository } from './users-servers.repository';

describe('UsersServersController', () => {
  let controller: UsersServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersServersController],
      imports: [DatabaseModule],

      providers: [UsersServersService, UsersServersRepository],
    }).compile();

    controller = module.get<UsersServersController>(UsersServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
