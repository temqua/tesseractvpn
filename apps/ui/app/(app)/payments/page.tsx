'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Table, { IColumn } from '../../components/table';
import { paymentsClient } from '../../lib/api/payments/client';
import { IPayment } from '../../lib/api/payments/definitions';

const columns: IColumn<IPayment>[] = [
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
	const { error, data } = useSuspenseQuery({
		queryKey: ['payments-all'],
		queryFn: () => paymentsClient.getAll(),
	});
	if (error) {
		return <div>Error {error.message}</div>;
	}
	return (
		<div>
			<Table columns={columns} data={data} />
		</div>
	);
}
