import { PaymentStatus } from '../../enums';

export interface IPayment {
	id: string;
	paymentDate: string;
	amount: number;
	currency: string;
	monthsCount: number | null;
	expiresOn: string | null;
	userId: number;
	parentPaymentId: string | null;
	planId: number | null;
	status: PaymentStatus;
}

export interface ICreatePaymentDto {
	userId: number;
	amount: number;
	monthsCount: number;
	expiresOn?: string;
	planId?: number | null;
	parentPaymentId?: string | null;
	status: PaymentStatus;
}

export interface IUpdatePaymentDto extends Partial<ICreatePaymentDto> {
	paymentDate: string;
}
