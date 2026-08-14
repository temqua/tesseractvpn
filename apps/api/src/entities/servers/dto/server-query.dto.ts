import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from 'src/enums';

export enum OrderByServerField {
  ID = 'id',
  Name = 'name',
}

export class ServerQueryDto extends BaseListDto {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsOptional()
  @IsEnum(OrderByServerField)
  orderBy?: OrderByServerField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
