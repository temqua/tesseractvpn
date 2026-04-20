import { IsBoolean, IsString } from 'class-validator';

export class CreateBotIncomingMessageDto {
  @IsString()
  telegramId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName?: string;

  @IsString()
  username?: string;

  @IsBoolean()
  isBot?: boolean;
}
