import ExpenseClientSide from '@/features/expenses/components/single';
import { expensesSSRClient } from '@/features/expenses/lib/ssr-client';
import { use } from 'react';
export default async function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const data = await expensesSSRClient.getById(id);
	console.log('data :>> ', data);
	return <ExpenseClientSide data={data} id={id}></ExpenseClientSide>;
}
