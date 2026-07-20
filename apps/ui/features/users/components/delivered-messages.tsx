'use client';
import ContentArea from '@/app/components/content-area';
import Table, { IColumn } from '@/app/components/table';
import { IBotDeliveredMessage } from '@/app/lib/api/bot-delivered-messages/definitions';
import { IPayment } from '@/app/lib/api/payments/definitions';

interface IUserDeliveredMessagesPageProps {
	initialData: IBotDeliveredMessage[];
	count?: number;
}

const columns: IColumn<IBotDeliveredMessage>[] = [
	{
		label: 'ID',
		prop: 'id',
		searchable: true,
	},
	{
		label: 'Message',
		prop: 'message',
	},
	{
		label: 'Created At',
		prop: 'createdAt',
	},
];

export default function UserDeliveredMessagesClientSide({ initialData, count }: IUserDeliveredMessagesPageProps) {
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={initialData ?? []} count={count ?? 0} page={1} take={count ?? 0} />
			</ContentArea>
		</div>
	);
}
