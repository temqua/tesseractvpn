import { useActionState } from 'react';
import { auth } from '@/app/lib/actions';
import { Button } from './button';

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(auth, undefined);

	return (
		<form action={formAction} className="flex flex-col gap-8">
			<div>
				<label htmlFor="username">Username</label>
				<input id="username" name="username" placeholder="Username" />
			</div>
			{state?.errors?.username && <p>{state.errors.username}</p>}
			<div>
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" />
			</div>
			{state?.errors?.password && (
				<div>
					<p>Password must:</p>
					<ul>
						{state.errors.password.map(error => (
							<li key={error}>- {error}</li>
						))}
					</ul>
				</div>
			)}
			<Button className="cursor-pointer" disabled={isPending} type="submit">
				Sign in
				{isPending ? 'Loading...' : 'Sign in'}
			</Button>
		</form>
	);
}
