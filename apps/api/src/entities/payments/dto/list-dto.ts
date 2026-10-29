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
  @IsString()
  id?: string;
  @IsString()
  userId?: string;
  @IsString()
  planId?: string;
  @IsString()
  from?: string;
  @IsString()
  to?: string;
  @IsString()
  sheet?: string;
  @IsNumber()
  monthsCount?: number;
  @IsNumber()
  amount?: number;
  @IsOptional()
  @IsEnum(OrderByPaymentField)
  orderBy?: OrderByPaymentField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

export class UserPaymentsListDto extends BaseListDto {
  @IsString()
  id?: string;
  @IsString()
  from?: string;
  @IsString()
  to?: string;
  @IsNumber()
  monthsCount?: number;
  @IsNumber()
  amount?: number;
  @IsOptional()
  @IsEnum(OrderByPaymentField)
  orderBy?: OrderByPaymentField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
