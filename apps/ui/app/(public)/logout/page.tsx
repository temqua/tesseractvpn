'use client';
import { redirect, RedirectType } from 'next/navigation';
import { authSessionKey } from '../../lib/api/auth';
import { authClient } from '../../lib/api/auth/client';

export default function LogoutPage() {
	authClient
		.logout()
		.catch(err => {
			console.error(err);
		})
		.finally(() => {
			localStorage.removeItem(authSessionKey);
			redirect('/', RedirectType.replace);
		});
	return <></>;
}
