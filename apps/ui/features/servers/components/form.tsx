'use client';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { getUpdateAction } from '@/app/lib/actions/servers';
import { IServer } from '@/app/lib/api/servers/definitions';
import { useActionState, useState } from 'react';
import { ServerFormState } from '../lib/definitions';

export default function ServerClientSide({ data, id }: { data: IServer; id: string }) {
	const updateAction = getUpdateAction(id);
	const [state, formAction, isPendingUpdate] = useActionState<ServerFormState, FormData>(updateAction, {});
	const [name, setName] = useState(data?.name);
	const [url, setUrl] = useState(data?.url);
	return (
		<form action={formAction}>
			<div className="flex flex-col">
				<label htmlFor="name">Name</label>
				<Input
					value={name}
					onChange={event => setName(event.target.value)}
					id="name"
					name="name"
					placeholder="Name"
				/>
			</div>
			{state?.errors?.properties?.name && <p>{state.errors?.properties.name?.errors.join()}</p>}

			<div className="flex flex-col">
				<label htmlFor="url">URL</label>
				<Input
					value={url}
					onChange={event => setUrl(event.target.value)}
					id="url"
					name="url"
					type="url"
					placeholder="URL"
				/>
			</div>
			{state?.errors?.properties?.url && <p>{state.errors?.properties.url?.errors.join()}</p>}
			<Button type="submit">Submit</Button>
		</form>
	);
}
