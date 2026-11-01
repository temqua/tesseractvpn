import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByUnauthorizedMessageField {
  ID = 'id',
  TelegramId = 'telegramId',
  CreatedAt = 'createdAt',
}

export class UnauthorizedUsersDeliveredMessagesQueryDto extends BaseListDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramId?: string;
  @ApiPropertyOptional({ enum: OrderByUnauthorizedMessageField })
  @IsOptional()
  @IsEnum(OrderByUnauthorizedMessageField)
  orderBy?: OrderByUnauthorizedMessageField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
