'use client';
import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { serversClient } from '@/app/lib/api/servers/client';
import { IUserServer, IUserServerUI } from '@/app/lib/api/users-servers/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

export interface IServerUsersPageProps {
	initialData: IUserServer[];
	count: number;
	id: string;
}

const baseColumns: IColumn<IUserServerUI>[] = [
	{
		label: 'ID',
		prop: 'id',
		sortable: true,
	},
	{
		label: 'User ID',
		prop: 'userId',
	},
	{
		label: 'Username',
		prop: 'username',
		sortable: true,
	},
	{
		label: 'Protocol',
		prop: 'protocol',
		sortable: true,
	},
	{
		label: 'Assigned At',
		prop: 'assignedAt',
		sortable: true,
	},
];

interface IServerUserForm {
	id?: string;
	username?: string;
	protocol?: string;
}

interface IServerUserFormWithOrder extends IServerUserForm {
	orderBy?: keyof IServerUserForm;
	orderDirection?: OrderDirection;
}

export default function ServerUsersClientSide({ initialData, id: serverId, count }: IServerUsersPageProps) {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const username = searchParams.get('username');
	const protocol = searchParams.get('protocol');
	const orderBy = (searchParams.get('orderBy') as keyof IServerUserForm) || '';
	const orderDirection = (searchParams.get('orderDirection') as OrderDirection) || '';
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

	const handleSort = useCallback(
		(prop?: keyof IUserServerUI) => {
			if (!prop) {
				return;
			}
			const newDirection = orderDirection ? (orderDirection === 'asc' ? 'desc' : 'asc') : 'asc';
			updateParams({ orderBy: prop, orderDirection: newDirection });
		},
		[orderDirection],
	);
	const { data: fetched, isLoading } = useQuery({
		queryKey: ['serverUsers', page, take, id, orderBy, orderDirection, protocol, username],
		queryFn: () => {
			const params: IListParams & Partial<IServerUserFormWithOrder> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (protocol) params.protocol = protocol;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
			if (username) params.username = username;
			return serversClient.getUsers(serverId, params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});

	const searchRow = useMemo(
		() => (
			<>
				<th>
					<Input
						type="search"
						placeholder={'ID'}
						defaultValue={id}
						onChange={event => debouncedUpdateFilter('id', event.target.value)}
					></Input>
				</th>
				<th></th>
				<th>
					<Input
						type="search"
						placeholder={'Username'}
						defaultValue={username ?? undefined}
						onChange={event => debouncedUpdateFilter('username', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Protocol'}
						defaultValue={protocol ?? undefined}
						onChange={event => debouncedUpdateFilter('protocol', event.target.value)}
					></Input>
				</th>

				<th></th>
			</>
		),
		[debouncedUpdateFilter],
	);

	const prepared: IUserServerUI[] =
		fetched?.data.map(us => {
			return {
				id: us.id,
				username: us.username,
				assignedAt: us.assignedAt,
				protocol: us.protocol,
				userId: us.userId,
			};
		}) ?? [];

	const queryClient = useQueryClient();
	return (
		<ContentArea>
			<Table
				searchRow={searchRow}
				columns={baseColumns}
				data={prepared}
				count={fetched?.count ?? 0}
				page={page}
				take={take}
				onChangePage={handlePageChange}
				onChangeTake={handleTakeChange}
				onSort={handleSort}
				loading={isLoading}
			/>
		</ContentArea>
	);
}
