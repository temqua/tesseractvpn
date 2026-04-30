'use client';

import { useEffect, useState } from 'react';
import Table, { IColumn } from '../../components/table';
import { paymentsClient } from '../../lib/api/payments/client';

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
	const [payments, setPayments] = useState([]);
	useEffect(() => {
		paymentsClient.getAll().then(res => {
			setPayments(res);
		});
	}, []);
	return (
		<div>
			<Table columns={columns} data={payments} />
		</div>
	);
}
