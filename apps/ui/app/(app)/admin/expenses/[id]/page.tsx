import ExpenseClientSide from '@/features/expenses/components/form';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';
export default async function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const data = await expensesSSRClient.getById(id);
	return <ExpenseClientSide data={data} id={id}></ExpenseClientSide>;
}
