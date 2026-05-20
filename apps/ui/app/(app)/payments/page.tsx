import PaymentsClientSide from '@/features/payments/components/all';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';

export default async function PaymentsPage() {
	const data = await paymentsSSRClient.getAll();
	return <PaymentsClientSide data={data} />;
}
