import { OrderDirection } from '@/app/lib/enums';
import PaymentsClientSide from '@/features/payments/components/all';
import { paymentsSSRClient } from '@/features/payments/lib/ssr-client';
import ServersClientSide from '@/features/servers/components/all';
import { serversSSRClient } from '@/features/servers/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function ServersPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		url?: string;
		name?: string;
		orderBy?: string;
		orderDirection?: OrderDirection;
	}>;
}) {
	const searchParams = await props.searchParams;
	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	const url = searchParams.url || '';
	const name = searchParams.name || '';
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
		redirect(`/admin/servers?${params.toString()}`);
	}
	const response = await serversSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(url && { url }),
		...(name && { name }),
		...(orderBy && { orderBy }),
		...(orderDirection && { orderDirection }),
	});

	return <ServersClientSide initialData={response.data} count={response.count} />;
}
