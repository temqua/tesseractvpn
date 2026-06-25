import ExpensesClientSide from '@/features/expenses/components/all';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';

export default async function ExpensesPage() {
	const { data, count } = await expensesSSRClient.getAll({
		skip: 0,
		take: 25,
	});
	return <ExpensesClientSide data={data} count={count} />;
}
