import { IPayment } from '@/app/lib/api/payments/definitions';
import { IErrorBody } from '@/app/lib/definitions.global';
import z from 'zod';

export const PaymentFormSchema = z.object({
	amount: z.number().min(1, { error: 'Payment must be positive number.' }),
	userId: z.number(),
	monthsCount: z.number().min(1, { error: 'Payment must be for at least 1 month' }),
	expiresOn: z.string(),
	planId: z.number().nullable().optional(),
	parentPaymentId: z.string().nullable().optional(),
});

export type PaymentFormState =
	| {
			data?: IPayment & IErrorBody;
			errors?: {
				errors: string[];
				properties?: {
					amount?: {
						errors: string[];
					};
					monthsCount?: {
						errors: string[];
					};
					expiresOn?: {
						errors: string[];
					};
					userId?: {
						errors: string[];
					};
					planId?: {
						errors: string[];
					};
					parentPaymentId?: {
						errors: string[];
					};
				};
			};
			message?: string;
	  }
	| undefined;
