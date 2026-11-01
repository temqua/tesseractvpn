import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class IPaymentProcessDto {
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  dependants?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  nalog?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  referral?: boolean;
}
