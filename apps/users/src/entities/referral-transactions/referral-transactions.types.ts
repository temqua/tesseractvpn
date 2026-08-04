import { CmdCode, ReferralTransactionCommand } from '../../enums';
import { Payment } from '../payments/payments.types';
import { User } from '../users/users.types';

export type ReferralTransaction = {
	id: string;
	referrerId: number;
	referredId: number;
	paymentId: string;
	createdAt: string;
	payment: Payment;
	referrer: User;
	referred: User;
};

export class CreateReferralTransactionDto {
	referrerId: number;
	referredId: number;
	paymentId: string;
}

export interface ReferralTransactionsContext {
	[CmdCode.Command]: ReferralTransactionCommand;
	id?: string;
}
