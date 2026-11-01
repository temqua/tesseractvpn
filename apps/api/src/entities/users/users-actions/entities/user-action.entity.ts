import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserAction {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiPropertyOptional({ example: '/start', nullable: true })
  command?: string | null;

  @ApiPropertyOptional({ example: 'start', nullable: true })
  action?: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}
