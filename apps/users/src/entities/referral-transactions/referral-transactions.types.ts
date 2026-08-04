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
