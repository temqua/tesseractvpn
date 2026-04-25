import { Device } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  telegramId: string | null;
  telegramLink?: string;
  languageCode?: string;
  lastName?: string;
  payerId: number | null;
  devices?: Device[];
}
