import { PartialType } from '@nestjs/swagger';
import { CreateUsersActionDto } from './create-users-action.dto';

export class UpdateUsersActionDto extends PartialType(CreateUsersActionDto) {}
