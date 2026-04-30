'use client';

import { useEffect, useState } from 'react';
import Table, { IColumn } from '../../components/table';
import { expensesClient } from '../../lib/api/expenses/client';

const columns: IColumn[] = [
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
];

export default function PaymentsPage() {
	const [expenses, setExpenses] = useState([]);
	useEffect(() => {
		expensesClient.getAll().then(res => {
			setExpenses(res);
		});
	}, []);
	return (
		<div>
			<Table columns={columns} data={expenses} />
		</div>
	);
}
