import { ExpenseCategory } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class ExpenseListDto {
  @IsNumber()
  take: number;
  @IsNumber()
  skip: number;

  @IsString()
  filterBy?: string;

  @IsString()
  filterValue?: string;

  @IsString()
  filterOperation?: string;
}
