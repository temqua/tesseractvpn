import { PartialType } from '@nestjs/swagger';
import { CreateReferralTransactionDto } from './create-referral-transaction.dto';

export class UpdateReferralTransactionDto extends PartialType(
  CreateReferralTransactionDto,
) {}
