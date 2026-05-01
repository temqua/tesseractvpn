'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ContentArea from '../../components/content-area';
import Table, { IColumn } from '../../components/table';
import { expensesClient } from '../../lib/api/expenses/client';
import { IExpense } from '../../lib/api/expenses/definitions';

const columns: IColumn<IExpense>[] = [
	{
		label: 'ID',
		prop: 'id',
	},
	{
		label: 'Payment Date',
		prop: 'paymentDate',
	},
	{
		label: 'Amount',
		prop: 'amount',
	},
	{
		label: 'Category',
		prop: 'category',
	},
	{
		label: 'Actions',
		actions: row => {
			return (
				<>
					<Link href={`/expenses/${row.id}`}>✏️</Link>
					<button onClick={() => console.log('delete', row)}>🗑️</button>
				</>
			);
		},
	},
];

export default function ExpensesPage() {
	const { error, data } = useSuspenseQuery({
		queryKey: ['expenses-all'],
		queryFn: () => expensesClient.getAll(),
	});
	if (error) {
		return (
			<div>
				<ContentArea>Error: {error.message}</ContentArea>
			</div>
		);
	}
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={data} />
			</ContentArea>
		</div>
	);
}
