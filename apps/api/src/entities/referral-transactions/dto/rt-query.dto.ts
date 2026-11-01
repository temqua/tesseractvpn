import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';

export class ReferralTransactionQueryDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referrerId?: number;

  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  referredId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentId?: string;
}
