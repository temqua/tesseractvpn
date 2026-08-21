'use client';
import { auth } from '@/app/lib/actions/auth';
import { useActionState } from 'react';
import { Button } from './button';
import { FieldSet } from './field';
import FormField from './form-field';
import { Input } from './input';
import TelegramAuth from './telegram-auth';

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(auth, undefined);

	return (
		<form action={formAction}>
			<FieldSet className="mb-8">
				<FormField id="username" label="Username" errors={state?.errors?.properties?.username?.errors}>
					<Input
						id="username"
						name="username"
						placeholder="Username"
						aria-invalid={Boolean(state?.errors?.properties?.username?.errors.length)}
					/>
				</FormField>
				<FormField id="password" label="Password" errors={state?.errors?.properties?.password?.errors}>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Password"
						aria-invalid={Boolean(state?.errors?.properties?.password?.errors.length)}
					/>
				</FormField>
			</FieldSet>
			<div className="flex flex-col gap-8 items-center">
				<Button className="cursor-pointer w-full" disabled={isPending} type="submit">
					{isPending ? 'Loading...' : 'Sign in'}
				</Button>
				<TelegramAuth />
				{state?.errors.errors.length ? state?.errors.errors.join(',') : ''}
			</div>
		</form>
	);
}
