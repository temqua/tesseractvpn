'use client';
import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { usersClient } from '@/app/lib/api/users/client';
import { IVPNUser } from '@/app/lib/api/users/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { debounce } from '@/app/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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
	lastName?: string;
}

export default function UsersClientSide({ data, count }: { data: IVPNUser[]; count?: number }) {
	const [searchFilters, setSearchFilters] = useState<IUserForm>({
		id: '',
		username: '',
		firstName: '',
	});
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isModalOpened, setModalOpened] = useState(false);
	// const [searchBy, setSearchBy] = useState('' as keyof IUserForm);
	// const [searchValue, setSearchValue] = useState('');
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
	const [take, setTake] = useState(Number(searchParams.get('take')) || 25);

	const setFilter = (key: keyof IUserForm, value: string) => {
		setSearchFilters(prev => ({
			...prev,
			[key]: value,
		}));
	};
	const debouncedSetFilter = debounce(setFilter, 1000);
	const { data: fetched } = useQuery({
		queryKey: ['users', page, take, searchFilters],
		queryFn: () => {
			const params: IListParams & Partial<IUserForm> = { skip: (page - 1) * take, take };
			for (const key of Object.keys(searchFilters)) {
				if (searchFilters[key] !== '') {
					params[key] = searchFilters[key];
				}
			}
			return usersClient.getAll(params);
		},

		placeholderData: page === 1 ? { data, count: data.length } : undefined,
	});
	const searchRow = (
		<>
			<th key={'id'}>
				<Input
					type="search"
					placeholder={'ID'}
					onChange={event => debouncedSetFilter('id', event.target.value)}
				></Input>
			</th>
			<th key={'username'}>
				<Input
					type="search"
					placeholder={'Username'}
					onChange={event => debouncedSetFilter('username', event.target.value)}
				></Input>
			</th>
			<th key={'firstName'}>
				<Input
					type="search"
					placeholder={'First name'}
					onChange={event => debouncedSetFilter('firstName', event.target.value)}
				></Input>
			</th>
			<th></th>
		</>
	);
	const queryClient = useQueryClient();

	useEffect(() => {
		queryClient.setQueryData(['users', page, take, searchFilters], {
			data,
			count,
		});
	}, [data, count, page, take]);
	// queryClient.setQueryData(['users', page, take], data);
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
				<Table
					columns={columns}
					data={fetched?.data ?? []}
					count={fetched?.count ?? 0}
					page={page}
					take={take}
					searchRow={searchRow}
					onChangePage={input => {
						console.log('input :>> ', input);
						setPage(input);
						router.push(pathname + '?' + createQueryString('page', input.toString()));
					}}
					onChangeTake={input => {
						setTake(input);
						router.push(pathname + '?' + createQueryString('take', input.toString()));
					}}
				/>
			</ContentArea>
		</div>
	);
}
