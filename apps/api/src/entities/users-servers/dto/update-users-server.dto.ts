import { PartialType } from '@nestjs/swagger';
import { CreateUsersServerDto } from './create-users-server.dto';

export class UpdateUsersServerDto extends PartialType(CreateUsersServerDto) {}
