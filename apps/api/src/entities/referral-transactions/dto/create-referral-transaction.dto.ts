import { IsNumber, IsString } from 'class-validator';

export class CreateReferralTransactionDto {
  @IsNumber()
  referrerId: number;
  @IsNumber()
  referredId: number;
  @IsString()
  paymentId: string;
}
