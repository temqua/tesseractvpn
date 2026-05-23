import { CmdCode, PaymentCommand } from '../../enums';
import { Plan } from '../plans/plans.types';
import { VPNUser } from '../users/users.types';

export interface PaymentsContext {
	[CmdCode.Command]: PaymentCommand;
	id?: string;
}

export interface CreatePaymentDto {
	userId: number;

	amount: number;

	monthsCount: number | null;

	expiresOn: string | null;

	planId?: number | null;

	parentPaymentId?: string | null;
}

export interface PaymentSumDto {
	amount: string;
}

export interface PaymentForSheet extends Payment {
	user: VPNUser;
	plan: Plan;
}

export type Payment = {
	id: string;
	currency: string;
	userId: number;
	paymentDate: string;
	amount: number;
	monthsCount: number | null;
	expiresOn: string | null;
	parentPaymentId: string | null;
	planId: number | null;
	plan: Plan;
};
