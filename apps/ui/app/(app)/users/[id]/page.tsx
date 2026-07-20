import UserClientSide from '@/features/users/components/form';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const response = await usersSSRClient.getById(id);
	return <UserClientSide user={response} id={id}></UserClientSide>;
}
