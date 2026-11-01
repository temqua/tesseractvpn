import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BotUnauthorizedDeliveredMessage {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiPropertyOptional({ example: '123456789', nullable: true })
  telegramId?: string | null;

  @ApiProperty({ example: 'Текст сообщения' })
  message: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}
