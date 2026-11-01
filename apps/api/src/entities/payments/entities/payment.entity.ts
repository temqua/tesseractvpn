import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class Payment {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: '2026-11-01T00:00:00.000Z' })
  paymentDate: Date;

  @ApiProperty({ example: 150 })
  amount: number;

  @ApiProperty({ example: 'RUB' })
  currency: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  monthsCount?: number | null;

  @ApiPropertyOptional({ example: '2026-12-01T00:00:00.000Z', nullable: true })
  expiresOn?: Date | null;

  @ApiPropertyOptional({ example: 'uuid', nullable: true })
  parentPaymentId?: string | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  planId?: number | null;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiPropertyOptional({ example: 'yookassa-id', nullable: true })
  yookassaPaymentId?: string | null;
}
