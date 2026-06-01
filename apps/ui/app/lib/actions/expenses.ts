import { QueryClient } from '@tanstack/react-query';
import { expensesClient } from '../api/expenses/client';
import { ExpenseCategory, IExpense } from '../api/expenses/definitions';
import { IErrorBody } from '../definitions.global';
import { ExpenseFormSchema, ExpenseFormState } from '@/features/expenses/lib/definitions';
import { treeifyError } from 'zod';
import { toast } from '@/app/components/toast';

export async function createAction(state: ExpenseFormState, formData: FormData) {
	const validatedFields = ExpenseFormSchema.safeParse({
		amount: Number(formData.get('amount')),
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
			category: formData.get('category') as ExpenseCategory,
			description: formData.get('description') ?? '',
		});
		if (response.ok) {
			toast.success(`Expense has been successfully created`);
		}
		const data: IExpense & IErrorBody = await response.json();
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
	return async function (state: ExpenseFormState, formData: FormData) {
		const validatedFields = ExpenseFormSchema.safeParse({
			amount: Number(formData.get('amount')),
			category: formData.get('category'),
			description: formData.get('description'),
		});
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response = await expensesClient.update(id, {
				amount: Number(formData.get('amount')),
				category: formData.get('category') as ExpenseCategory,
				description: formData.get('description') as string,
				paymentDate: formData.get('paymentDate') as string,
			});
			if (response.ok) {
				toast.success(`Expense has been successfully created`);
			}
			const data: IErrorBody & IExpense = await response.json();
			return {
				data,
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
	queryClient.invalidateQueries({ queryKey: ['expenses-all'] });
	const response = await expensesClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['expenses-all'], (oldData: IExpense[]) => oldData.filter(item => item.id !== id));
	}
}
