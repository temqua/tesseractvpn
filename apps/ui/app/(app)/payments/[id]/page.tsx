import PaymentClientSide from '@/features/payments/components/form';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
export default async function PaymentsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await paymentsSSRClient.getById(id);
	return <PaymentClientSide data={data} id={id}></PaymentClientSide>;
}
