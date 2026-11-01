import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Plan {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Базовый' })
  name: string;

  @ApiProperty({ example: 150 })
  amount: number;

  @ApiProperty({ example: 1 })
  months: number;

  @ApiProperty({ example: 150 })
  price: number;

  @ApiProperty({ example: 'RUB' })
  currency: string;

  @ApiProperty({ example: 1 })
  minCount: number;

  @ApiProperty({ example: 3 })
  maxCount: number;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({ example: false, nullable: true })
  legacy?: boolean | null;
}
