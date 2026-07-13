import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from './plans.service';
import { PlansRepository } from './plans.repository';
import { DatabaseModule } from '../../database.module';

describe('PlansService', () => {
  let service: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PlansService, PlansRepository],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
