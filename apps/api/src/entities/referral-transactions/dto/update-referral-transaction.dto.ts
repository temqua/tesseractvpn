import { PartialType } from '@nestjs/mapped-types';
import { CreateReferralTransactionDto } from './create-referral-transaction.dto';

export class UpdateReferralTransactionDto extends PartialType(
  CreateReferralTransactionDto,
) {}
