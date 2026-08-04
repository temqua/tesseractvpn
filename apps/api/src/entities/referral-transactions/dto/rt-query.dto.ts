import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByUserField {
  Username = 'username',
  FirstName = 'firstName',
}

export class ReferralTransactionQueryDto extends BaseListDto {
  @IsString()
  @IsOptional()
  id?: string;
  @IsNumber()
  @IsOptional()
  referrerId?: number;

  @IsNumber()
  @IsOptional()
  referredId?: number;

  @IsString()
  @IsOptional()
  paymentId?: string;
}
