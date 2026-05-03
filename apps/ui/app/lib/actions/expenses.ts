import { QueryClient } from '@tanstack/react-query';
import { expensesClient } from '../api/expenses/client';
import { IExpense } from '../api/expenses/definitions';
import { FormState } from '../definitions';

export async function updateAction(state: FormState, formData: FormData) {
	console.log('formData :>> ', formData);
}

export async function deleteAction(id: string, queryClient: QueryClient) {
	queryClient.invalidateQueries({ queryKey: ['expenses-all'] });
	const response = await expensesClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['expenses-all'], (oldData: IExpense[]) => oldData.filter(item => item.id !== id));
	}
}
