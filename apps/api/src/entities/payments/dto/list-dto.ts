import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from 'src/enums';

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
  from?: string;
  @IsString()
  to?: string;
  @IsString()
  sheet?: string;
  @IsNumber()
  monthsCount?: number;
  @IsOptional()
  @IsEnum(OrderByPaymentField)
  orderBy?: OrderByPaymentField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
new URLSearchParams();
