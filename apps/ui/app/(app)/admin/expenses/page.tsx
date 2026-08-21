import { OrderDirection } from '@/app/lib/enums';
import ExpensesClientSide from '@/features/expenses/components/all';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function ExpensesPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		amount?: string;
		orderBy?: string;
		orderDirection?: OrderDirection;
	}>;
}) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const orderBy = searchParams.orderBy;
	const orderDirection = searchParams.orderDirection;
	const id = searchParams.id || '';
	const amount = searchParams.amount || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		for (const [key, value] of Object.entries(searchParams)) {
			if (value) {
				params.set(key, value);
			}
		}
		redirect(`/admin/expenses?${params.toString()}`);
	}
	const response = await expensesSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(amount && { amount }),
		...(orderBy && { orderBy }),
		...(orderDirection && { orderDirection }),
	});
	return <ExpensesClientSide initialData={response.data} count={response.count} />;
}
