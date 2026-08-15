'use client';

import ActionsCell from '@/app/components/actions-cell';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/servers';
import { serversClient } from '@/app/lib/api/servers/client';
import { IServer } from '@/app/lib/api/servers/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

const baseColumns: IColumn<IServer>[] = [
	{
		label: 'ID',
		prop: 'id',
		sortable: true,
	},
	{
		label: 'Name',
		prop: 'name',
		sortable: true,
	},
	{
		label: 'URL',
		prop: 'url',
	},
];
interface IServerForm {
	id?: string;
	name?: string;
	url?: string;
}

interface IServerFormWithOrder extends IServerForm {
	orderBy?: keyof IServerForm;
	orderDirection?: OrderDirection;
}

interface IServersPageProps {
	initialData: IServer[];
	count?: number;
}

export default function ServersClientSide({ initialData, count }: IServersPageProps) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const name = searchParams.get('name') || '';
	const url = searchParams.get('url') || '';
	const orderBy = (searchParams.get('orderBy') as keyof IServerForm) || '';
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
	const columns: IColumn<IServer>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<ActionsCell>
						<Link href={`/servers/${row.id}`}>
							<Pencil />
						</Link>
						<button
							onClick={() => {
								setDeleteId(row.id.toString());
								setModalOpened(true);
							}}
						>
							<Trash />
						</button>
					</ActionsCell>
				);
			},
		},
	];

	const { data: fetched, isLoading } = useQuery({
		queryKey: ['servers', page, take, id, name, url, orderBy, orderDirection],
		queryFn: () => {
			const params: IListParams & IServerFormWithOrder = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (name) params.name = name;
			if (url) params.url = url;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
			return serversClient.getAll(params);
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
				<th>
					<Input
						type="search"
						placeholder={'Name'}
						defaultValue={name}
						onChange={event => debouncedUpdateFilter('name', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'URL'}
						defaultValue={url}
						onChange={event => debouncedUpdateFilter('url', event.target.value)}
					></Input>
				</th>
				<th></th>
			</>
		),
		[debouncedUpdateFilter],
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
		(prop?: keyof IServer) => {
			if (!prop) {
				return;
			}
			const newDirection = orderDirection ? (orderDirection === 'asc' ? 'desc' : 'asc') : 'asc';
			updateParams({ orderBy: prop, orderDirection: newDirection });
		},
		[orderDirection],
	);
	const queryClient = useQueryClient();

	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/servers/new`}>ADD</Link>
				</div>
				<Table
					searchRow={searchRow}
					columns={columns}
					data={fetched?.data ?? []}
					count={fetched?.count ?? 0}
					page={page}
					take={take}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
					onSort={handleSort}
					loading={isLoading}
				/>
			</ContentArea>
			<Dialog open={isModalOpened}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Confirm</DialogTitle>
					</DialogHeader>
					Are you sure you want to delete server?
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setModalOpened(false);
								if (deleteId) {
									deleteAction(deleteId, queryClient, id, name, url);
								}
							}}
						>
							Confirm
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setModalOpened(false);
							}}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
