import { PartialType } from '@nestjs/swagger';
import { CreateBotUnauthorizedUserActionDto } from './create-bot-unauthorized-user-action.dto';

export class UpdateBotUnauthorizedUserActionDto extends PartialType(
  CreateBotUnauthorizedUserActionDto,
) {}
