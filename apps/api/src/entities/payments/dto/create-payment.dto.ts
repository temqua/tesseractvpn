import { PaymentStatus } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  monthsCount: number | null;

  @IsString()
  expiresOn: string | null;

  status?: PaymentStatus;

  @IsNumber()
  planId?: number | null;

  @IsString()
  parentPaymentId?: string | null;
}
