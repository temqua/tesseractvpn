'use client';
import { useEffect, useState } from 'react';
import Table, { IColumn } from '../../components/table';
import { usersClient } from '@/app/lib/api/users/client';

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
	const [users, setUsers] = useState([]);
	useEffect(() => {
		usersClient.getAll().then(res => {
			setUsers(res);
		});
	}, []);
	return (
		<div>
			<Table columns={columns} data={users} />
		</div>
	);
}
