import { IsBoolean } from 'class-validator';

export class PaymentApproveDto {
  @IsBoolean()
  addNalog: boolean;
}
