import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByUserServerField {
  AssignedAt = 'assignedAt',
  Protocol = 'protocol',
}

export class UserServerQueryDto extends BaseListDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  url?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  protocol?: string;
  @ApiPropertyOptional({ enum: OrderByUserServerField })
  @IsOptional()
  @IsEnum(OrderByUserServerField)
  orderBy?: OrderByUserServerField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
