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
}

export interface ICreatePaymentDto {
	userId: number;
	amount: number;
	monthsCount: number;
	expiresOn: string;
	planId?: number | null;
	parentPaymentId?: string | null;
}

export type IUpdatePaymentDto = Partial<ICreatePaymentDto>;
