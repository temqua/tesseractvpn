import { useActionState } from 'react';
import { authAction } from '@/app/lib/actions';
import { Button } from './button';

export default function LoginForm() {
	const [errorMessage, formAction, isPending] = useActionState(authAction, null);

	return (
		<form action={formAction} className="flex flex-col gap-8">
			<input name="username" type="text" />
			<input name="password" type="password" id="" />
			<Button className="cursor-pointer" disabled={isPending}>
				Sign in
				{isPending ? 'Loading...' : 'Sign in'}
			</Button>
		</form>
	);
}
