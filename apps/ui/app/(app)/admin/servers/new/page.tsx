'use client';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import { FieldSet } from '@/app/components/field';
import FormField from '@/app/components/form-field';
import { createAction } from '@/app/lib/actions/servers';
import { ServerFormState } from '@/features/servers/lib/definitions';
import { Input } from '@/app/components/input';
import { useActionState, useState } from 'react';

export default function NewServer() {
	const [state, formAction, isPendingUpdate] = useActionState<ServerFormState, FormData>(createAction, {});
	const [name, setName] = useState('');
	const [url, setUrl] = useState('');
	return (
		<ContentArea>
			<form action={formAction}>
				<FieldSet>
					<FormField id="name" label="Name" errors={state?.errors?.properties?.name?.errors}>
						<Input
							value={name}
							onChange={event => setName(event.target.value)}
							id="name"
							name="name"
							placeholder="Name"
							aria-invalid={Boolean(state?.errors?.properties?.name?.errors)}
							required
						/>
					</FormField>
					<FormField id="url" label="URL" errors={state?.errors?.properties?.url?.errors}>
						<Input
							value={url}
							onChange={event => setUrl(event.target.value)}
							id="url"
							name="url"
							type="url"
							placeholder="URL"
							required
							aria-invalid={Boolean(state?.errors?.properties?.url?.errors)}
						/>
					</FormField>
					<Button type="submit">Submit</Button>
				</FieldSet>
			</form>
		</ContentArea>
	);
}
