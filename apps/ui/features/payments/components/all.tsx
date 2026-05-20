'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import Table, { IColumn } from '@/app/components/table';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

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

export default function PaymentsClientSide({ data }: { data: IPayment[] }) {
	// const { error, data } = useSuspenseQuery({
	//     queryKey: ['payments-all'],
	//     queryFn: () => paymentsClient.getAll(),
	// });
	// if (error) {
	//     return <div>Error {error.message}</div>;
	// }
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const queryClient = useQueryClient();
	queryClient.setQueryData(['payments-all'], data);
	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/payments/new`}>ADD</Link>
				</div>
				{/* <Table searchRow={searchRow} columns={columns} data={filteredData} /> */}
				<Table columns={columns} data={data} />
			</ContentArea>
			<div>
				<Dialog
					isOpened={isModalOpened}
					onCancel={() => setModalOpened(false)}
					onClose={() => setModalOpened(false)}
					onConfirm={() => {
						setModalOpened(false);
						if (deleteId) {
							// deleteAction(deleteId, queryClient);
						}
					}}
				>
					Are you sure you want to delete payment?
				</Dialog>
			</div>
		</div>
	);
}
