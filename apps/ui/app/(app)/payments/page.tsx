import PaymentsClientSide from '@/features/payments/components/all';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function PaymentsPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		userId?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	const userId = searchParams.userId || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		for (const [key, value] of Object.entries(searchParams)) {
			if (value) {
				params.set(key, value);
			}
		}
		redirect(`/payments?${params.toString()}`);
	}
	const response = await paymentsSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(userId && { userId }),
	});

	return <PaymentsClientSide initialData={response.data} count={response.count} />;
}
