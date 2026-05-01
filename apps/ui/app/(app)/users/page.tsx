'use client';
import { usersClient } from '@/app/lib/api/users/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import ContentArea from '../../components/content-area';
import Table, { IColumn } from '../../components/table';

const columns: IColumn[] = [
	{
		label: 'ID',
		prop: 'id',
	},
	{
		label: 'Username',
		prop: 'username',
	},
	{
		label: 'First name',
		prop: 'firstName',
	},
	{
		label: 'Last name',
		prop: 'lastName',
	},
];

export default function UsersPage() {
	const { error, data } = useSuspenseQuery({
		queryKey: ['users-all'],
		queryFn: () => usersClient.getAll(),
	});
	if (error) {
		return <div>Error {error.message}</div>;
	}
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={data} />
			</ContentArea>
		</div>
	);
}
