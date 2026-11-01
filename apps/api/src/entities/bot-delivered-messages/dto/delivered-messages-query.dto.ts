import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByDeliveredMessagesField {
  ID = 'id',
  UserId = 'userId',
  CreateAt = 'createdAt',
}

export class DeliveredMessagesQueryDto extends BaseListDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;
  @ApiPropertyOptional({ enum: OrderByDeliveredMessagesField })
  @IsOptional()
  @IsEnum(OrderByDeliveredMessagesField)
  orderBy?: OrderByDeliveredMessagesField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
