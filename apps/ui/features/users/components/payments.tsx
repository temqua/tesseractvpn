'use client';
import ContentArea from '@/app/components/content-area';
import Table, { IColumn } from '@/app/components/table';
import { IPayment } from '@/app/lib/api/payments/definitions';

interface IUserPaymentsPageProps {
	initialData: IPayment[];
	count?: number;
}

const columns: IColumn<IPayment>[] = [
	{
		label: 'ID',
		prop: 'id',
		searchable: true,
	},
	{
		label: 'Payment Date',
		prop: 'paymentDate',
		searchable: true,
	},
	{
		label: 'Amount',
		prop: 'amount',
		searchable: true,
	},
	{
		label: 'Months count',
		prop: 'monthsCount',
		searchable: true,
	},
	{
		label: 'Expires on',
		prop: 'expiresOn',
		searchable: true,
	},
	{
		label: 'userId',
		prop: 'userId',
		searchable: true,
	},
	{
		label: 'planId',
		prop: 'planId',
		searchable: true,
	},
	{
		label: 'parentPaymentId',
		prop: 'parentPaymentId',
		searchable: true,
	},
];

export default function UserPaymentsClientSide({ initialData, count }: IUserPaymentsPageProps) {
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={initialData ?? []} count={count ?? 0} page={1} take={count ?? 0} />
			</ContentArea>
		</div>
	);
}
