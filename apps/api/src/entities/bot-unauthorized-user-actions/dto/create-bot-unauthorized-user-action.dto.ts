import { IsBoolean, IsString } from 'class-validator';

export class CreateBotUnauthorizedUserActionDto {
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

  @IsString()
  command?: string;

  @IsString()
  action?: string;
}
