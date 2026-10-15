import { IsBoolean } from 'class-validator';

export class IPaymentProcessDto {
  @IsBoolean()
  dependants?: boolean;
  @IsBoolean()
  nalog: boolean;
}
