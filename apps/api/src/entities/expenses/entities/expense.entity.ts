import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';

export class Expense {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: '2026-11-01T00:00:00.000Z' })
  paymentDate: Date;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: 'RUB' })
  currency: string;

  @ApiProperty({ enum: ExpenseCategory, example: ExpenseCategory.Servers })
  category: ExpenseCategory;

  @ApiPropertyOptional({ example: 'Оплата серверов', nullable: true })
  description?: string | null;
}
