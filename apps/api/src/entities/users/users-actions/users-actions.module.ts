import { Module } from '@nestjs/common';
import { UserExistsPipe } from '../user-exists-pipe';
import { UsersModule } from '../users.module';
import { UsersActionsController } from './users-actions.controller';
import { UsersActionsRepository } from './users-actions.repository';
import { UsersActionsService } from './users-actions.service';

@Module({
  controllers: [UsersActionsController],
  imports: [UsersModule],
  providers: [UsersActionsService, UsersActionsRepository, UserExistsPipe],
})
export class UsersActionsModule {}
