import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReferralTransactionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  referrerId: number;
  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  referredId: number;
  @ApiProperty({ example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  paymentId: string;
}
