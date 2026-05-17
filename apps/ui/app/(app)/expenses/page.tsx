import ExpensesClientSide from '@/features/expenses/components/all';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';

export default async function ExpensesPage() {
	const data = await expensesSSRClient.getAll();
	return <ExpensesClientSide data={data} />;
}
