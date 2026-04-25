import { PartialType } from '@nestjs/mapped-types';
import { CreateBotUnauthorizedDeliveredMessageDto } from './create-bot-unauthorized-delivered-message.dto';

export class UpdateBotUnauthorizedDeliveredMessageDto extends PartialType(
  CreateBotUnauthorizedDeliveredMessageDto,
) {}
