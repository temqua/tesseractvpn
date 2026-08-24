'use client';
import { redirect, RedirectType } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authSessionKey, TGAuthParams, tgSessionKey, tgUserKey } from '../lib/api/auth';
import { authClient } from '../lib/api/auth/client';

export default function TelegramAuth({
	onError,
	onSubmit,
}: {
	onError(message: string): void;
	onSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}) {
	const [isLoaded, setLoaded] = useState(false);
	async function onTelegramAuth(input: TGAuthParams & { error: string }) {
		if (process.env.NEXT_PUBLIC_APP_ENV === 'local') {
			input.id_token = process.env.NEXT_PUBLIC_MOCK_TG_TOKEN ?? '';
			input.user = JSON.parse(process.env.NEXT_PUBLIC_MOCK_TG_USER ?? '');
		}
		console.log('input :>> ', input);
		if (input.id_token && input.user) {
			try {
				const result = await authClient.authTelegram(input as TGAuthParams);
				if (result.token) {
					localStorage.setItem(authSessionKey, result.token);
					localStorage.setItem(tgSessionKey, input.id_token);
					localStorage.setItem(tgUserKey, JSON.stringify(input.user));
					location.href = `${location.origin}/`;
				}
			} catch (error) {
				onError(`${error}`);
			}
		} else {
			onError(`${input.error}`);
		}
	}

	useEffect(() => {
		setLoaded(true);
		window.onTelegramAuth = onTelegramAuth;
	}, []);
	if (!isLoaded) {
		return <></>;
	}
	return (
		<>
			<script
				async
				src="https://oauth.telegram.org/js/telegram-login.js?5"
				data-client-id={process.env.NEXT_PUBLIC_TG_CLIENT_ID}
				data-onauth="onTelegramAuth(data)"
			></script>
			<button
				onClick={e => {
					onSubmit(e);
				}}
				type="button"
				className="tg-auth-button"
			>
				Sign In with Telegram
			</button>
		</>
	);
}
