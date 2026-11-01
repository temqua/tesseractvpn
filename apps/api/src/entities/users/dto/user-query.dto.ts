import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByUserField {
  ID = 'id',
  Username = 'username',
  FirstName = 'firstName',
  LastName = 'lastName',
  TelegramId = 'telegramId',
}

export class UserQueryDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramLink?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  price?: string;
  @ApiPropertyOptional({ enum: OrderByUserField })
  @IsOptional()
  @IsEnum(OrderByUserField)
  orderBy?: OrderByUserField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsIn(['true', 'false'])
  @IsOptional()
  active?: string;
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsIn(['true', 'false'])
  @IsOptional()
  free?: string;
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsIn(['true', 'false'])
  @IsOptional()
  muted?: string;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  paymentsOrder?: OrderDirection;
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  expiresAfterDays?: number;
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsIn(['true', 'false'])
  @IsOptional()
  trial?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  select?: string;
}
