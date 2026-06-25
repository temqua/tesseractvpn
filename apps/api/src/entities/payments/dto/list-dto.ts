import { IsString } from 'class-validator';
import { BaseListDto } from 'src/dto/base-dto';

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
}
new URLSearchParams();
