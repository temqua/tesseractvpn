import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByPlanField {
  Amount = 'amount',
  Price = 'price',
  Id = 'id',
  Months = 'months',
  CreatedAt = 'createdAt',
}

export class SearchPlanDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  count?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  minCount?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  maxCount?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  price?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  months?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  amount?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional({ enum: OrderByPlanField })
  @IsOptional()
  @IsEnum(OrderByPlanField)
  orderBy?: OrderByPlanField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  select?: string;
}
