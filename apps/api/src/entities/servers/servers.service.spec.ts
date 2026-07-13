import { Test, TestingModule } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { ServersRepository } from './servers.repository';
import { DatabaseModule } from '../../database.module';

describe('ServersService', () => {
  let service: ServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServersService, ServersRepository],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
