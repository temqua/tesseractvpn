import { ExpenseCategory } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class ExpenseListDto {
  @IsString()
  category: ExpenseCategory;
  @IsNumber()
  take: number;
  @IsNumber()
  skip: number;
}
