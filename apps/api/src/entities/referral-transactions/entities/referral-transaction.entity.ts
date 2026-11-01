import { ApiProperty } from '@nestjs/swagger';

export class ReferralTransaction {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  referrerId: number;

  @ApiProperty({ example: 2 })
  referredId: number;

  @ApiProperty({ example: 'uuid' })
  paymentId: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}
