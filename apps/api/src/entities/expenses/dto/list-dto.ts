import { ExpenseCategory } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from 'src/enums';

export enum OrderByExpenseField {
  Amount = 'amount',
  PaymentDate = 'paymentDate',
}

export class ExpenseListDto extends BaseListDto {
  @IsString()
  id?: string;

  @IsString()
  from?: string;

  @IsString()
  to?: string;

  @IsString()
  category?: ExpenseCategory;

  @IsOptional()
  @IsEnum(OrderByExpenseField)
  orderBy?: OrderByExpenseField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
