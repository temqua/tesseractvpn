import PaymentsClientSide from '@/features/payments/components/all';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function PaymentsPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
	}>;
}) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		redirect(`/payments?${params.toString()}`);
	}
	const response = await paymentsSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
	});

	return <PaymentsClientSide initialData={response.data} count={response.count} />;
}
