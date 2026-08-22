'use client';
import { useEffect, useRef, useState } from 'react';
import { TGAuthParams, tgSessionKey } from '../lib/api/auth';
import { authClient } from '../lib/api/auth/client';
import { redirect, RedirectType } from 'next/navigation';

async function onTelegramAuth(input: TGAuthParams & { error: string }) {
	console.log('input :>> ', input);
	if (input.id_token && input.user) {
		const result = await authClient.authTelegram(input as TGAuthParams);
		if (result.token) {
			localStorage.setItem(tgSessionKey, result.token);
			redirect('/', RedirectType.replace);
		}
	} else {
		console.error(input.error);
	}
}
export default function TelegramAuth() {
	const [isLoaded, setLoaded] = useState(false);

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
			<button type="button" className="tg-auth-button">
				Sign In with Telegram
			</button>
		</>
	);
}
