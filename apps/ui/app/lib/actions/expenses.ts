import { QueryClient } from '@tanstack/react-query';
import { expensesClient } from '../api/expenses/client';
import { IExpense } from '../api/expenses/definitions';
import { FormState } from '../definitions';
import { IErrorBody } from '../definitions.global';

export async function createAction(state: FormState, formData: FormData) {
	try {
		const response: Response = await expensesClient.create({
			amount: Number(formData.get('amount')),
			category: formData.get('category'),
			description: formData.get('description'),
		});
		const data: IExpense & IErrorBody = await response.json();
		console.log(data);
		if (response.ok) {
			return data;
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
				errors: [err],
			},
		};
	}
}

export async function updateAction(state: FormState, formData: FormData) {
	try {
		const response: IErrorBody & IExpense = await expensesClient.update({
			amount: Number(formData.get('amount')),
			category: formData.get('category'),
			description: formData.get('description'),
		});
	} catch (err) {
		return {
			errors: {
				errors: [err],
			},
		};
	}
}

export async function deleteAction(id: string, queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: ['expenses-all'] });
	const response = await expensesClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['expenses-all'], (oldData: IExpense[]) => oldData.filter(item => item.id !== id));
	}
}
