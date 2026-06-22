import { PaymentFormSchema, PaymentFormState } from '@/features/payments/lib/definitions';
import { QueryClient } from '@tanstack/react-query';
import { treeifyError } from 'zod';
import { IExpense } from '../api/expenses/definitions';
import { paymentsClient } from '../api/payments/client';
import { IPayment } from '../api/payments/definitions';
import { IErrorBody } from '../definitions.global';
import { toast } from '@/app/components/toast';

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
			expiresOn: formData.get('expiresOn') as string,
			parentPaymentId: formData.get('parentPaymentId') as string,
			planId: Number(formData.get('planId')),
			userId: Number(formData.get('userId')),
		});
		if (response.ok) {
			toast.success(`Payment has been successfully created`);
		}
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
			paymentDate: formData.get('paymentDate'),
		});
		console.log('validatedFields :>> ', validatedFields);
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response = await paymentsClient.update(id, {
				amount: Number(formData.get('amount')),
				monthsCount: Number(formData.get('monthsCount')),
				expiresOn: formData.get('expiresOn') as string,
				// parentPaymentId: formData.get('parentPaymentId'),
				// planId: Number(formData.get('planId')),
				paymentDate: formData.get('paymentDate') as string,
				userId: Number(formData.get('userId')),
			});
			if (response.ok) {
				toast.success(`Payment ${id} has been successfully updated`);
			}
			const data: IErrorBody & IExpense = await response.json();
			return {
				data: data,
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
