import { ExpenseCategory } from '@prisma/client';
import { IsString } from 'class-validator';
import { BaseListDto } from 'src/dto/base-dto';
export class ExpenseListDto extends BaseListDto {
  @IsString()
  id?: string;

  @IsString()
  from?: string;

  @IsString()
  to?: string;

  @IsString()
  category?: ExpenseCategory;
}
