import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from 'src/dto/base-dto';
import { OrderDirection } from 'src/enums';

export enum OrderByPlanField {
  Amount = 'amount',
  Price = 'price',
  Id = 'id',
  ExpiresOn = 'expiresOn',
}

export class SearchPlanDto extends BaseListDto {
  @IsString()
  name?: string;
  @IsNumber()
  count?: number;
  @IsNumber()
  minCount?: number;
  @IsNumber()
  maxCount?: number;
  @IsNumber()
  price?: number;
  @IsNumber()
  months?: number;
  @IsNumber()
  amount?: number;
  @IsNumber()
  id?: number;
  @IsOptional()
  @IsEnum(OrderByPlanField)
  orderBy?: OrderByPlanField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
