import { QueryClient } from '@tanstack/react-query';
import { serversClient } from '../api/servers/client';
import { IServer } from '../api/servers/definitions';
import { ServerFormCreateSchema, ServerFormEditSchema, ServerFormState } from '@/features/servers/lib/definitions';
import { toast } from '@/app/components/toast';
import { IErrorBody } from '../definitions.global';
import { treeifyError } from 'zod';

export async function createAction(state: ServerFormState, formData: FormData) {
	const body = {
		name: (formData.get('name') as string) ?? '',
		url: (formData.get('url') as string) ?? '',
	};
	const validatedFields = ServerFormCreateSchema.safeParse(body);
	if (!validatedFields.success) {
		return {
			errors: treeifyError(validatedFields.error),
		};
	}
	try {
		const response: Response = await serversClient.create(body);
		if (response.ok) {
			toast.success(`Server has been successfully created`);
		}
		const data: IServer & IErrorBody = await response.json();
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

export async function deleteAction(id: string, queryClient: QueryClient, ...params: (string | number)[]) {
	queryClient.invalidateQueries({ queryKey: ['servers'] });
	const response = await serversClient.delete(id);
	if (response.ok) {
		queryClient.setQueryData(['servers', ...params], (oldData: IServer[]) =>
			oldData.filter(item => item.id !== Number(id)),
		);
	}
}

export function getUpdateAction(id: string) {
	return async function (state: ServerFormState, formData: FormData) {
		const body = {
			name: (formData.get('name') as string) ?? '',
			url: (formData.get('url') as string) ?? '',
		};
		const validatedFields = ServerFormEditSchema.safeParse(body);
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response = await serversClient.update(id, body);
			if (response.ok) {
				toast.success(`Server ${id} has been successfully updated`);
			}
			const data: IErrorBody & IServer = await response.json();
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
