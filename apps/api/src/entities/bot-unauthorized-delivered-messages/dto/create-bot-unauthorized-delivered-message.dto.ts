import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBotUnauthorizedDeliveredMessageDto {
  @ApiProperty({ example: 'Текст сообщения' })
  @IsString()
  @IsNotEmpty()
  message: string;
  @ApiPropertyOptional({ example: '123456789', nullable: true })
  @IsString()
  @IsOptional()
  telegramId?: string;
}
