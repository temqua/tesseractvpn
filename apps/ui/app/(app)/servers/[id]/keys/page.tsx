import env from '@/app/lib/env';
import { serversSSRClient } from '@/features/servers/lib/ssr-client';

export default async function ServerKeys({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const server = await serversSSRClient.getById(id);
	const response = await fetch(`${server.url}:8090/list`, {
		headers: {
			'Authorization': env.SERVICE_TOKEN,
		},
	});
	const keys = await response.text();

	return <div>{keys}</div>;
}
