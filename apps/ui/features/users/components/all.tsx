'use client';
import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import Table, { IColumn } from '@/app/components/table';
import { usersClient } from '@/app/lib/api/users/client';
import { IVPNUserListDTO, IVPNUserUI } from '@/app/lib/api/users/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

const baseColumns: IColumn<IVPNUserUI>[] = [
	{ label: 'ID', prop: 'id' },
	{ label: 'Username', prop: 'username' },
	{ label: 'First name', prop: 'firstName' },
	{ label: 'Last name', prop: 'lastName' },
	{ label: 'Active', prop: 'active' },
	{ label: 'Free', prop: 'free' },
];

interface IUsersPageProps {
	initialData: IVPNUserListDTO[];
	count?: number;
}

export default function UsersClientSide({ initialData, count }: IUsersPageProps) {
	const searchParams = useSearchParams();

	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const id = searchParams.get('id') || '';
	const active = searchParams.get('active') || '';
	const free = searchParams.get('free') || '';
	const username = searchParams.get('username') || '';
	const firstName = searchParams.get('firstName') || '';

	const updateParams = useUpdateParams(useRouter(), usePathname());

	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const debouncedUpdateFilter = useCallback(
		(key: string, value: string) => {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(() => {
				updateParams({ [key]: value, page: 1 }); // сброс страницы при новом фильтре
			}, 500);
		},
		[updateParams],
	);

	const columns: IColumn<IVPNUserUI>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<>
						<Link href={`/users/${row.id}`}>✏️</Link>
						<Link href={`/users/${row.id}/delivered-messages`}>M</Link>
						<Link href={`/users/${row.id}/payments`}>💰</Link>
					</>
				);
			},
		},
	];

	const { data: fetched } = useQuery({
		queryKey: ['users', page, take, id, username, firstName, active, free],
		queryFn: () => {
			const params: IListParams & Record<string, string> = { skip: (page - 1) * take, take } as any;
			if (id) params.id = id;
			if (username) params.username = username;
			if (firstName) params.firstName = firstName;
			if (active) params.active = active;
			if (free) params.free = free;
			return usersClient.getAll(params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});

	const prepared: IVPNUserUI[] =
		fetched?.data.map(u => {
			return {
				id: u.id,
				active: u.active,
				username: u.username,
				createdAt: u.createdAt,
				firstName: u.firstName,
				lastName: u.lastName,
				free: u.free,
				muted: u.muted,
				price: u.price,
				telegramId: u.telegramId,
				telegramLink: u.telegramLink,
				password: u.password,
				languageCode: u.languageCode,
			};
		}) ?? [];

	const handlePageChange = useCallback(
		(newPage: number | ((p: number) => number)) => {
			const resolved = typeof newPage === 'function' ? newPage(page) : newPage;
			updateParams({ page: resolved });
		},
		[page, updateParams],
	);

	const handleTakeChange = useCallback(
		(newTake: number | ((t: number) => number)) => {
			const resolved = typeof newTake === 'function' ? newTake(take) : newTake;
			updateParams({ take: resolved, page: 1 });
		},
		[take, updateParams],
	);

	const searchRow = useMemo(
		() => (
			<>
				<th>
					<Input
						type="search"
						placeholder="ID"
						defaultValue={id}
						onChange={e => debouncedUpdateFilter('id', e.target.value)}
					/>
				</th>
				<th>
					<Input
						type="search"
						placeholder="Username"
						defaultValue={username}
						onChange={e => debouncedUpdateFilter('username', e.target.value)}
					/>
				</th>
				<th>
					<Input
						type="search"
						placeholder="First name"
						defaultValue={firstName}
						onChange={e => debouncedUpdateFilter('firstName', e.target.value)}
					/>
				</th>
				<th></th>
				<th>
					<Select onChange={event => debouncedUpdateFilter('active', event.target.value)}>
						<option value=""></option>
						<option value="true">True</option>
						<option value="false">False</option>
					</Select>
				</th>
				<th>
					<Select onChange={event => debouncedUpdateFilter('free', event.target.value)}>
						<option value=""></option>
						<option value="true">True</option>
						<option value="false">False</option>
					</Select>
				</th>
				<th></th>
			</>
		),
		[debouncedUpdateFilter],
	);

	return (
		<div>
			<ContentArea>
				<Table
					columns={columns}
					data={prepared}
					count={fetched?.count ?? 0}
					page={page}
					take={take}
					searchRow={searchRow}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
				/>
			</ContentArea>
		</div>
	);
}
