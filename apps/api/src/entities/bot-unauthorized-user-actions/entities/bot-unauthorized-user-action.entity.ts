import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BotUnauthorizedUserAction {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '123456789' })
  telegramId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe', nullable: true })
  lastName?: string | null;

  @ApiPropertyOptional({ example: 'john_doe', nullable: true })
  username?: string | null;

  @ApiProperty({ example: false })
  isBot: boolean;

  @ApiPropertyOptional({ example: '/start', nullable: true })
  command?: string | null;

  @ApiPropertyOptional({ example: 'start', nullable: true })
  action?: string | null;

  @ApiPropertyOptional({ example: 'ru', nullable: true })
  languageCode?: string | null;
}
