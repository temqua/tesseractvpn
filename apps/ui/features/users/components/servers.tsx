'use client';
import ActionsCell from '@/app/components/actions-cell';
import ContentArea from '@/app/components/content-area';
import Table, { IColumn } from '@/app/components/table';
import { IUserServer, IUserServerUI } from '@/app/lib/api/users-servers/definitions';
import { Download, QrCode, Server } from 'lucide-react';

interface IUserServersPageProps {
	initialData: IUserServer[];
	count?: number;
}

const baseColumns: IColumn<IUserServerUI>[] = [
	{
		label: 'ID',
		prop: 'id',
	},
	{
		label: 'Username',
		prop: 'username',
	},
	{
		label: 'URL',
		prop: 'url',
	},
	{
		label: 'Protocol',
		prop: 'protocol',
	},
	{
		label: 'Assigned At',
		prop: 'assignedAt',
	},
];

export default function UserServersClientSide({ initialData, count }: IUserServersPageProps) {
	const prepared =
		initialData.map(row => ({
			id: row.id,
			url: row.server.url,
			username: row.username,
			assignedAt: row.assignedAt,
			protocol: row.protocol,
			downloadLink: row.downloadLink,
			qrLink: row.qrLink,
		})) ?? [];
	const columns: IColumn<IUserServerUI>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<ActionsCell>
						<a href={row.downloadLink}>
							<Download />
						</a>
						{row.qrLink && (
							<a href={row.qrLink}>
								<QrCode />
							</a>
						)}
					</ActionsCell>
				);
			},
		},
	];
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={prepared} count={count ?? 0} page={1} take={count ?? 0} />
			</ContentArea>
		</div>
	);
}
