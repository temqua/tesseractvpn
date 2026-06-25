import PaymentsClientSide from '@/features/payments/components/all';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';

export default async function PaymentsPage() {
	const { data, count } = await paymentsSSRClient.getAll({
		skip: 0,
		take: 25,
	});
	return <PaymentsClientSide data={data} count={count} />;
}
