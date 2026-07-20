import UserDeliveredMessagesClientSide from '@/features/users/components/delivered-messages';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UserDeliveredMessagesPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const response = await usersSSRClient.getById(id);
	return (
		<UserDeliveredMessagesClientSide
			count={response.messageDeliveries.length}
			initialData={response.messageDeliveries}
		></UserDeliveredMessagesClientSide>
	);
}
