import { IsNumber } from 'class-validator';

export class PaymentInitDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  planId: number;
}
