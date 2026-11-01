import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  monthsCount?: number | null;

  @ApiPropertyOptional({ example: '2026-12-01T00:00:00.000Z', nullable: true })
  @IsString()
  @IsOptional()
  expiresOn?: string | null;

  @ApiPropertyOptional({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsNumber()
  @IsOptional()
  planId?: number | null;

  @ApiPropertyOptional({ example: 'uuid', nullable: true })
  @IsString()
  @IsOptional()
  parentPaymentId?: string | null;
}
