import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBotUnauthorizedUserActionDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe', nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john_doe', nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isBot?: boolean;

  @ApiPropertyOptional({ example: '/start', nullable: true })
  @IsString()
  @IsOptional()
  command?: string;

  @ApiPropertyOptional({ example: 'start', nullable: true })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiPropertyOptional({ example: 'ru', nullable: true })
  @IsString()
  @IsOptional()
  languageCode?: string;
}
