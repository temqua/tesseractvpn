import { PartialType } from '@nestjs/swagger';
import { CreateBotIncomingMessageDto } from './create-bot-incoming-message.dto';

export class UpdateBotIncomingMessageDto extends PartialType(
  CreateBotIncomingMessageDto,
) {}
