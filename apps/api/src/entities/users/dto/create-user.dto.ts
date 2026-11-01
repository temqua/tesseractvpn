import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Device } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ example: 'John', nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe', nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ example: '123456789', nullable: true })
  @IsString()
  @IsOptional()
  telegramId?: string | null;

  @ApiPropertyOptional({ example: 'https://t.me/john_doe', nullable: true })
  @IsString()
  @IsOptional()
  telegramLink?: string | null;

  @ApiPropertyOptional({ example: 'ru', default: 'ru', nullable: true })
  @IsString()
  @IsOptional()
  languageCode?: string | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  payerId?: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  @IsNumber()
  @IsOptional()
  referrerId?: number | null;

  @ApiPropertyOptional({ example: 150, default: 150 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Устройства пользователя',
    enum: Device,
    isArray: true,
  })
  @IsArray()
  @IsEnum(Device, { each: true })
  @IsOptional()
  devices?: Device[];

  @ApiPropertyOptional({ example: 'secret' })
  @IsString()
  @IsOptional()
  password?: string;
}
