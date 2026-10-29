import PaymentClientSide from '@/features/payments/components/form';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
import { plansSSRClient } from '@/features/plans/lib/ssr-client';
import { usersSSRClient } from '@/features/users/lib/ssr-client';
export default async function PaymentsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const paymentPromise = paymentsSSRClient.getById(id);
	const usersPromise = usersSSRClient.getAll({
		select: ['id', 'username'],
	});
	const plansPromise = plansSSRClient.getAll();
	const [response, usersResponse, plansResponse] = await Promise.all([paymentPromise, usersPromise, plansPromise]);

	const users = usersResponse.data.map(u => ({
		label: u.username,
		value: u.id.toString(),
	}));
	const plans = plansResponse.data.map(p => ({
		label: p.name,
		value: p.id.toString(),
	}));
	return <PaymentClientSide data={response} id={id} users={users} plans={plans}></PaymentClientSide>;
}
