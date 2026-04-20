import { PartialType } from '@nestjs/mapped-types';
import { CreateBotIncomingMessageDto } from './create-bot-incoming-message.dto';

export class UpdateBotIncomingMessageDto extends PartialType(
  CreateBotIncomingMessageDto,
) {}
