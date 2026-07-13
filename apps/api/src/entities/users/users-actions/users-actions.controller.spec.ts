import { Test, TestingModule } from '@nestjs/testing';
import { UsersActionsController } from './users-actions.controller';
import { UsersActionsService } from './users-actions.service';
import { UsersModule } from '../users.module';
import { DatabaseModule } from '../../../database.module';
import { UsersActionsRepository } from './users-actions.repository';
import { UserExistsPipe } from '../user-exists-pipe';
describe('UsersActionsController', () => {
  let controller: UsersActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersActionsController],

      imports: [UsersModule, DatabaseModule],
      providers: [UsersActionsService, UsersActionsRepository, UserExistsPipe],
    }).compile();

    controller = module.get<UsersActionsController>(UsersActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
