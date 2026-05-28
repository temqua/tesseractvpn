import { PaymentFormSchema, PaymentFormState } from '@/features/payments/lib/definitions';
import { QueryClient } from '@tanstack/react-query';
import { treeifyError } from 'zod';
import { IExpense } from '../api/expenses/definitions';
import { paymentsClient } from '../api/payments/client';
import { IPayment } from '../api/payments/definitions';
import { IErrorBody } from '../definitions.global';

export async function createAction(state: PaymentFormState, formData: FormData) {
	const validatedFields = PaymentFormSchema.safeParse({
		amount: Number(formData.get('amount')),
		monthsCount: Number(formData.get('monthsCount')),
		expiresOn: formData.get('expiresOn'),
		parentPaymentId: formData.get('parentPaymentId'),
		planId: formData.get('planId'),
		userId: formData.get('userId'),
	});
	if (!validatedFields.success) {
		return {
			errors: treeifyError(validatedFields.error),
		};
	}
	try {
		const response: Response = await paymentsClient.create({
			amount: Number(formData.get('amount')),
			monthsCount: Number(formData.get('monthsCount')),
			expiresOn: formData.get('expiresOn'),
			parentPaymentId: formData.get('parentPaymentId'),
			planId: formData.get('planId'),
			userId: formData.get('userId'),
		});
		const data: IPayment & IErrorBody = await response.json();
		if (response.ok) {
			return {
				data,
			};
		} else {
			return {
				errors: {
					errors: [data.message ?? 'Unknown Error'],
				},
			};
		}
	} catch (err) {
		return {
			errors: {
				errors: [err instanceof Error ? err.message : String(err)],
			},
		};
	}
}

export function getUpdateAction(id: string) {
	return async function (state: PaymentFormState, formData: FormData) {
		const validatedFields = PaymentFormSchema.safeParse({
			amount: Number(formData.get('amount')),
			monthsCount: Number(formData.get('monthsCount')),
			expiresOn: formData.get('expiresOn'),
			parentPaymentId: formData.get('parentPaymentId'),
			planId: Number(formData.get('planId')),
			userId: Number(formData.get('userId')),
		});
		if (!validatedFields.success) {
			console.log('validatedFields.error :>> ', validatedFields.error);
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response: IErrorBody & IExpense = await paymentsClient.update(id, {
				amount: Number(formData.get('amount')),
				monthsCount: Number(formData.get('monthsCount')),
				expiresOn: formData.get('expiresOn'),
				// parentPaymentId: formData.get('parentPaymentId'),
				// planId: Number(formData.get('planId')),
				userId: Number(formData.get('userId')),
			});
			return {
				data: response,
			};
		} catch (err) {
			return {
				errors: {
					errors: [err instanceof Error ? err.message : String(err)],
				},
			};
		}
	};
}

export async function deleteAction(id: string, queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: ['payments-all'] });
	const response = await paymentsClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['payments-all'], (oldData: IPayment[]) => oldData.filter(item => item.id !== id));
	}
}
