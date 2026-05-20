import { IExpense } from '@/app/lib/api/expenses/definitions';
import { IErrorBody } from '@/app/lib/definitions.global';
import z from 'zod';

export const ExpenseFormSchema = z.object({
	amount: z.number().min(1, { error: 'Expense must be positive number.' }),
	description: z.string().trim(),
	category: z.enum(['Servers', 'Nalog'], {
		error: 'Expense category must be Servers or Nalog',
	}),
});

export type ExpenseFormState =
	| {
			data?: IExpense & IErrorBody;
			errors?: {
				errors: string[];
				properties?: {
					amount?: {
						errors: string[];
					};
					description?: {
						errors: string[];
					};
					category?: {
						errors: string[];
					};
				};
			};
			message?: string;
	  }
	| undefined;
