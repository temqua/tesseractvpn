import { QueryClient } from '@tanstack/react-query';
import { expensesClient } from '../api/expenses/client';
import { IExpense } from '../api/expenses/definitions';
import { IErrorBody } from '../definitions.global';
import { ExpenseFormSchema, ExpenseFormState } from '@/features/expenses/lib/definitions';
import { treeifyError } from 'zod';

export async function createAction(state: ExpenseFormState, formData: FormData) {
	const validatedFields = ExpenseFormSchema.safeParse({
		amount: formData.get('amount'),
		category: formData.get('category'),
		description: formData.get('description'),
	});
	if (!validatedFields.success) {
		return {
			errors: treeifyError(validatedFields.error),
		};
	}
	try {
		const response: Response = await expensesClient.create({
			amount: Number(formData.get('amount')),
			category: formData.get('category'),
			description: formData.get('description') as string,
		});
		const data: IExpense & IErrorBody = await response.json();
		if (response.ok) {
			return {
				data,
			};
		} else {
			return {
				errors: {
					errors: [data.message],
				},
			};
		}
	} catch (err) {
		return {
			errors: {
				errors: [err] as string[],
			},
		};
	}
}

export async function getUpdateAction(id: string) {
	return async function (state: ExpenseFormState, formData: FormData) {
		const validatedFields = ExpenseFormSchema.safeParse({
			amount: formData.get('amount'),
			category: formData.get('category'),
			description: formData.get('description'),
		});
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response: IErrorBody & IExpense = await expensesClient.update(id, {
				amount: Number(formData.get('amount')),
				category: formData.get('category'),
				description: formData.get('description') as string,
			});
			return {
				data: response,
			};
		} catch (err) {
			return {
				errors: {
					errors: [err as string],
				},
			};
		}
	};
}

export async function deleteAction(id: string, queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: ['expenses-all'] });
	const response = await expensesClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['expenses-all'], (oldData: IExpense[]) => oldData.filter(item => item.id !== id));
	}
}
