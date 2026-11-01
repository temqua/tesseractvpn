import { PartialType } from '@nestjs/swagger';
import { CreateDeliveredMessageDto } from './create-delivered-message.dto';

export class UpdateDeliveredMessageDto extends PartialType(
  CreateDeliveredMessageDto,
) {}
