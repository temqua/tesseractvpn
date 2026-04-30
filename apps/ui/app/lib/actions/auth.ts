import { redirect, RedirectType } from 'next/navigation';
import { treeifyError } from 'zod';
import { authClient } from '../api/auth/client';
import { FormState, SignupFormSchema } from '../definitions';
import { authSessionKey } from '../api/auth';

export async function auth(state: FormState, formData: FormData) {
	const validatedFields = SignupFormSchema.safeParse({
		username: formData.get('username'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: treeifyError(validatedFields.error),
		};
	}
	const username = formData.get('username');
	const password = formData.get('password');
	let token;
	try {
		const r = await authClient.auth(username, password);
		token = r.token;
	} catch (err) {
		return {
			errors: {
				errors: [err],
			},
		};
	}
	if (token) {
		localStorage.setItem(authSessionKey, token);
		redirect('/', RedirectType.replace);
	} else {
		return {
			errors: {
				errors: ['No token received from the backend'],
			},
		};
	}
}

export async function signOut() {
	const result = await authClient.logout();
	if (result.success) {
		redirect('/', RedirectType.replace);
	}
}
