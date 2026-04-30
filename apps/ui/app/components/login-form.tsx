'use client';
import { useActionState } from 'react';
import { auth } from '@/app/lib/actions/auth';
import { Button } from './button';
import { Input } from './input';

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(auth, undefined);
	return (
		<form action={formAction} className="flex flex-col gap-8">
			<div className="flex flex-col">
				<label htmlFor="username">
					Username <span style={{ color: 'red' }}>*</span>
				</label>
				<Input id="username" name="username" placeholder="Username" />
			</div>
			{state?.errors?.properties?.username && <p>{state.errors?.properties.username?.errors.join()}</p>}
			<div className="flex flex-col">
				<label htmlFor="password">
					Password <span style={{ color: 'red' }}>*</span>
				</label>
				<Input id="password" name="password" type="password" placeholder="Password" />
			</div>
			{state?.errors?.properties?.password && (
				<div>
					<p>Password must:</p>
					<ul>{state.errors?.properties?.password?.errors.map(error => <li key={error}>- {error}</li>)}</ul>
				</div>
			)}
			<Button className="cursor-pointer" disabled={isPending} type="submit">
				{isPending ? 'Loading...' : 'Sign in'}
			</Button>

			{state?.errors.errors.length ? state?.errors.errors.join(',') : ''}
		</form>
	);
}
