import { toast } from '@/app/components/toast';
import { UserEditFormSchema, UserFormState } from '@/features/users/lib/definitions';
import { treeifyError } from 'zod';
import { usersClient } from '../api/users/client';
import { IVPNUser } from '../api/users/definitions';
import { IErrorBody } from '../definitions.global';

export function getUpdateAction(id: string) {
	return async function (state: UserFormState, formData: FormData) {
		const body = {
			username: (formData.get('username') as string) ?? undefined,
			firstName: formData.get('firstName') == '' ? null : (formData.get('firstName') as string),
			lastName: formData.get('lastName') == '' ? null : (formData.get('lastName') as string),
			rwLink: formData.get('rwLink') == '' ? null : (formData.get('rwLink') as string),
			telegramId: (formData.get('telegramId') as string) ?? undefined,
			telegramLink: formData.get('telegramLink') == '' ? null : (formData.get('telegramLink') as string),
			price: formData.get('price') ? Number(formData.get('price')) : undefined,
			active: Boolean(formData.get('active')),
			free: Boolean(formData.get('free')),
		};
		const validatedFields = UserEditFormSchema.safeParse(body);
		if (!validatedFields.success) {
			return {
				errors: treeifyError(validatedFields.error),
			};
		}
		try {
			const response = await usersClient.update(id, body);
			if (response.ok) {
				toast.success(`User ${id} has been successfully updated`);
			}
			const data: IErrorBody & IVPNUser = await response.json();
			return {
				data,
			};
		} catch (err) {
			console.error(err);
			return {
				errors: {
					errors: [err instanceof Error ? err.message : String(err)],
				},
			};
		}
	};
}
