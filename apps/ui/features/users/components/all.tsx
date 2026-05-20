'use client';
import ContentArea from '@/app/components/content-area';
import Table, { IColumn } from '@/app/components/table';
import { IVPNUser } from '@/app/lib/api/users/definitions';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const columns: IColumn<IVPNUser>[] = [
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

interface IUserForm {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
}

export default function UsersClientSide({ data }: { data: IVPNUser[] }) {
	const [searchFilters, setSearchFilters] = useState<IUserForm>({
		id: '',
		username: '',
		firstName: '',
		lastName: '',
	});
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isModalOpened, setModalOpened] = useState(false);
	queryClient.setQueryData(['users-all'], data);
	// const { error, data } = useSuspenseQuery({
	//     queryKey: ['users-all'],
	//     queryFn: () => usersClient.getAll(),
	// });
	// if (error) {
	//     return <div>Error {error.message}</div>;
	// }
	return (
		<div>
			<ContentArea>
				<Table columns={columns} data={data} />
			</ContentArea>
		</div>
	);
}
