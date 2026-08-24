import { OrderDirection } from '@/app/lib/enums';
import { UserPaymentsClientSide } from '@/features/payments/components/user';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function PaymentsPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		orderBy?: string;
		orderDirection?: OrderDirection;
		monthsCount?: string;
		amount?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	const monthsCount = searchParams.monthsCount || '';
	const amount = searchParams.amount || '';
	const orderBy = searchParams.orderBy;
	const orderDirection = searchParams.orderDirection;
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
	const response = await paymentsSSRClient.getForUser({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(monthsCount && { monthsCount }),
		...(amount && { amount }),
		...(orderBy && { orderBy }),
		...(orderDirection && { orderDirection }),
	});

	return <UserPaymentsClientSide initialData={response.data} count={response.count} />;
}
