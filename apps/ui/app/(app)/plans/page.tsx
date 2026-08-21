import { OrderDirection } from '@/app/lib/enums';
import PlansClientSide from '@/features/plans/components/all';
import { plansSSRClient } from '@/features/plans/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function PlansPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		minCount?: string;
		maxCount?: string;
		amount?: string;
		monthsCount?: string;
		orderBy?: string;
		price?: string;
		name?: string;
		orderDirection?: OrderDirection;
	}>;
}) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const orderBy = searchParams.orderBy;
	const orderDirection = searchParams.orderDirection;
	const id = searchParams.id || '';
	const price = searchParams.price || '';
	const amount = searchParams.amount || '';
	const monthsCount = searchParams.monthsCount || '';
	const minCount = searchParams.minCount || '';
	const maxCount = searchParams.maxCount || '';
	const name = searchParams.name || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		for (const [key, value] of Object.entries(searchParams)) {
			if (value) {
				params.set(key, value);
			}
		}
		redirect(`/plans?${params.toString()}`);
	}
	const response = await plansSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(price && { price }),
		...(amount && { amount }),
		...(monthsCount && { monthsCount }),
		...(name && { name }),
		...(minCount && { minCount }),
		...(maxCount && { maxCount }),
		...(orderBy && { orderBy }),
		...(orderDirection && { orderDirection }),
	});
	return <PlansClientSide initialData={response.data} count={response.count} />;
}
