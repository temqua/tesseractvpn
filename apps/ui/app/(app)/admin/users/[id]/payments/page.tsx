import UserPaymentsClientSide from '@/features/users/components/payments';
import { usersSSRClient } from '@/features/users/lib/ssr-client';

export default async function UserPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const response = await usersSSRClient.getById(id);
	return (
		<UserPaymentsClientSide
			count={response.payments.length}
			initialData={response.payments}
		></UserPaymentsClientSide>
	);
}
