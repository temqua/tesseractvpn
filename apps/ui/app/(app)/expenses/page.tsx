import ExpensesClientSide from '@/features/expenses/components/all';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function ExpensesPage(props: {
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
		redirect(`/expenses?${params.toString()}`);
	}
	const response = await expensesSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
	});
	return <ExpensesClientSide initialData={response.data} count={response.count} />;
}
