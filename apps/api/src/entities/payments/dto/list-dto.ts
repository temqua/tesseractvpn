import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';
import { PaymentStatus } from '@prisma/client';

export enum OrderByPaymentField {
  Amount = 'amount',
  PaymentDate = 'paymentDate',
  MonthsCount = 'monthsCount',
  ExpiresOn = 'expiresOn',
}

export class PaymentListDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  planId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  from?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  to?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sheet?: string;
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monthsCount?: number;
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;
  @ApiPropertyOptional({ enum: OrderByPaymentField })
  @IsOptional()
  @IsEnum(OrderByPaymentField)
  orderBy?: OrderByPaymentField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

export class UserPaymentsListDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  from?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  to?: string;
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monthsCount?: number;
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;
  @ApiPropertyOptional({ enum: OrderByPaymentField })
  @IsOptional()
  @IsEnum(OrderByPaymentField)
  orderBy?: OrderByPaymentField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
