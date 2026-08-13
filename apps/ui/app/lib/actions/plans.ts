import { toast } from '@/app/components/toast';
import { PlanFormSchema, PlanFormState } from '@/features/plans/lib/definitions';
import { QueryClient } from '@tanstack/react-query';
import { treeifyError } from 'zod';
import { plansClient } from '../api/plans/client';
import { IPlan } from '../api/plans/definitions';
import { IErrorBody } from '../definitions.global';

export async function createAction(state: PlanFormState, formData: FormData) {
	const body = {
		amount: Number(formData.get('amount')),
		monthsCount: Number(formData.get('monthsCount')),
		price: Number(formData.get('price')),
		minCount: Number(formData.get('minCount')),
		maxCount: Number(formData.get('maxCount')),
		name: (formData.get('name') as string) ?? '',
	};
	const validatedFields = PlanFormSchema.safeParse(body);
	if (!validatedFields.success) {
		return {
			errors: treeifyError(validatedFields.error),
		};
	}
	try {
		const response: Response = await plansClient.create(body);
		if (response.ok) {
			toast.success(`Plan has been successfully created`);
		}
		const data: IPlan & IErrorBody = await response.json();
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
	return async function (state: PlanFormState, formData: FormData) {
		const body = {
			amount: Number(formData.get('amount')),
			monthsCount: Number(formData.get('monthsCount')),
			price: Number(formData.get('price')),
			minCount: Number(formData.get('minCount')),
			maxCount: Number(formData.get('maxCount')),
			name: (formData.get('name') as string) ?? '',
		};
		const validatedFields = PlanFormSchema.safeParse(body);
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response = await plansClient.update(id, body);
			if (response.ok) {
				toast.success(`Plan ${id} has been successfully updated`);
			}
			const data: IErrorBody & IPlan = await response.json();
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
	queryClient.invalidateQueries({ queryKey: ['plans'] });
	const response = await plansClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['plans'], (oldData: IPlan[]) => oldData.filter(item => item.id !== Number(id)));
	}
}
