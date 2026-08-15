import { IExpense } from '@/app/lib/api/expenses/definitions';
import { IPlan } from '@/app/lib/api/plans/definitions';
import { IErrorBody } from '@/app/lib/definitions.global';
import z from 'zod';

export const PlanFormSchema = z.object({
	amount: z.number().min(1, { error: 'Must be positive number.' }),
	price: z.number().min(1, { error: 'Must be positive number.' }),
	minCount: z.number().min(1, { error: 'Must be positive number.' }),
	maxCount: z.number().min(1, { error: 'Must be positive number.' }),
	name: z.string().trim().nonempty(),
	monthsCount: z.number().min(1, { error: 'Must be positive number' }),
});
export type PlanFormState =
	| {
			data?: IPlan & IErrorBody;
			errors?: {
				errors: string[];
				properties?: {
					amount?: {
						errors: string[];
					};
					name?: {
						errors: string[];
					};
					minCount?: {
						errors: string[];
					};
					maxCount?: {
						errors: string[];
					};
					price?: {
						errors: string[];
					};
					monthsCount?: {
						errors: string[];
					};
				};
			};
			message?: string;
	  }
	| undefined;
