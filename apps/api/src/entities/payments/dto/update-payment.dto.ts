import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiPropertyOptional({ example: '2026-11-01T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  paymentDate?: string;
}
