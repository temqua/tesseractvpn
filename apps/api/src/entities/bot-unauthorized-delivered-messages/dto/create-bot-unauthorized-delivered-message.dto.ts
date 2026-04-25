import { IsString } from 'class-validator';

export class CreateBotUnauthorizedDeliveredMessageDto {
  @IsString()
  message: string;
  @IsString()
  telegramId?: string;
}
