import { IPayment } from '../payments/definitions';
import { IVPNUser } from '../users/definitions';

export interface IReferralTransaction {
	id: string;
	referrerId: number;
	referredId: number;
	paymentId: string;
	createdAt: string;
	payment: IPayment;
	referrer: IVPNUser;
	referred: IVPNUser;
}
