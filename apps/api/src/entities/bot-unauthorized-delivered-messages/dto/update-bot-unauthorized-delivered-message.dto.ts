import { PartialType } from '@nestjs/swagger';
import { CreateBotUnauthorizedDeliveredMessageDto } from './create-bot-unauthorized-delivered-message.dto';

export class UpdateBotUnauthorizedDeliveredMessageDto extends PartialType(
  CreateBotUnauthorizedDeliveredMessageDto,
) {}
