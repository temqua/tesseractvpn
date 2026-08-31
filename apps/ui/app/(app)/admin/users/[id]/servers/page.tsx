import { IUserServer } from '@/app/lib/api/users-servers/definitions';
import { ListResponse } from '@/app/lib/definitions.global';
import UserServersClientSide from '@/features/users/components/servers';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UserServers({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const response: ListResponse<IUserServer> = await usersSSRClient.getServers(id);

	return <UserServersClientSide count={response.data.length} initialData={response.data} />;
}
