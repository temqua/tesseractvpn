import ServerClientSide from '@/features/servers/components/form';
import { serversSSRClient } from '@/features/servers/lib/ssr-client';
export default async function PaymentsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await serversSSRClient.getById(id);
	return <ServerClientSide data={data} id={id}></ServerClientSide>;
}
