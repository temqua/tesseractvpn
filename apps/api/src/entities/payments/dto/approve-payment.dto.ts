import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class PaymentApproveDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Отправлять ли уведомление о подтверждении платежа в Telegram',
  })
  @IsBoolean()
  @IsOptional()
  notify?: boolean;
}
