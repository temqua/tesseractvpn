'use client';
import { redirect, RedirectType } from 'next/navigation';
import { authSessionKey } from '../../lib/api/auth';
import { authClient } from '../../lib/api/auth/client';
import { useEffect } from 'react';

export default function LogoutPage() {
	useEffect(() => {
		authClient
			.logout()
			.catch(err => {
				console.error(err);
			})
			.finally(() => {
				localStorage.removeItem(authSessionKey);
				redirect('/', RedirectType.replace);
			});
	}, []);

	return <></>;
}
