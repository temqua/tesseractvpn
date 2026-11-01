import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiPropertyOptional({ example: '2026-11-01T00:00:00.000Z' })
  @IsString()
  @IsOptional()
  paymentDate?: string;
}
