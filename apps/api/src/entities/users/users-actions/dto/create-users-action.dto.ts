import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsersActionDto {
  @ApiProperty({ example: '/start' })
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiPropertyOptional({ example: 'start' })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiPropertyOptional({ example: 'Текст' })
  @IsString()
  @IsOptional()
  message?: string;
}
