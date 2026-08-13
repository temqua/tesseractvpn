'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { getUpdateAction } from '@/app/lib/actions/servers';
import { IServer } from '@/app/lib/api/servers/definitions';
import { useActionState, useState } from 'react';
import { ServerFormState } from '../lib/definitions';
import FormField from '@/app/components/form-field';
import ContentArea from '@/app/components/content-area';
import { FieldSet } from '@/app/components/field';

export default function ServerClientSide({ data, id }: { data: IServer; id: string }) {
	const updateAction = getUpdateAction(id);
	const [state, formAction, isPendingUpdate] = useActionState<ServerFormState, FormData>(updateAction, {});
	const [name, setName] = useState(data?.name);
	const [url, setUrl] = useState(data?.url);
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
							aria-invalid={Boolean(state?.errors?.properties?.url?.errors)}
						/>
					</FormField>
					<Button type="submit">Submit</Button>
				</FieldSet>
			</form>
		</ContentArea>
	);
}
