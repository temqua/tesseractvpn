'use client';

import ActionsCell from '@/app/components/actions-cell';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/plans';
import { plansClient } from '@/app/lib/api/plans/client';
import { IPlan } from '@/app/lib/api/plans/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

interface IPlanPageProps {
	initialData: IPlan[];
	count?: number;
}

interface IPlanForm {
	id?: string;
	name?: string;
	amount?: string;
	months?: string;
	price?: string;
	minCount?: string;
	maxCount?: string;
}

interface IPlanFormWithOrder extends IPlanForm {
	orderBy?: keyof IPlanForm;
	orderDirection?: OrderDirection;
}

const baseColumns: IColumn<IPlan>[] = [
	{
		label: 'ID',
		prop: 'id',
		sortable: true,
	},
	{
		label: 'Name',
		prop: 'name',
	},
	{
		label: 'Amount',
		prop: 'amount',
		sortable: true,
	},
	{
		label: 'Months',
		prop: 'months',
		sortable: true,
	},
	{
		label: 'Price',
		prop: 'price',
		sortable: true,
	},
	{
		label: 'Currency',
		prop: 'currency',
	},
	{
		label: 'Min count',
		prop: 'minCount',
	},
	{
		label: 'Max count',
		prop: 'maxCount',
	},
	{
		label: 'Created At',
		prop: 'createdAt',
		sortable: true,
	},
];

export default function PlansClientSide({ initialData, count }: IPlanPageProps) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const price = searchParams.get('price');
	const monthsCount = searchParams.get('monthsCount');
	const amount = searchParams.get('amount');
	const minCount = searchParams.get('minCount');
	const maxCount = searchParams.get('maxCount');
	const name = searchParams.get('name');
	const orderBy = (searchParams.get('orderBy') as keyof IPlanForm) || '';
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

	const columns: IColumn<IPlan>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<ActionsCell>
						<Link href={`/admin/plans/${row.id}`}>
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
		queryKey: [
			'plans',
			page,
			take,
			id,
			orderBy,
			orderDirection,
			monthsCount,
			amount,
			price,
			minCount,
			maxCount,
			name,
		],
		queryFn: () => {
			const params: IListParams & Partial<IPlanFormWithOrder> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (price) params.price = price;
			if (amount) params.amount = amount;
			if (monthsCount) params.months = monthsCount;
			if (minCount) params.minCount = minCount;
			if (maxCount) params.maxCount = maxCount;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
			if (name) params.name = name;
			return plansClient.getAll(params);
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
						defaultValue={name ?? undefined}
						onChange={event => debouncedUpdateFilter('name', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Amount'}
						defaultValue={amount ?? undefined}
						onChange={event => debouncedUpdateFilter('amount', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Months count'}
						defaultValue={monthsCount ?? undefined}
						onChange={event => debouncedUpdateFilter('monthsCount', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Price'}
						onChange={event => debouncedUpdateFilter('price', event.target.value)}
					></Input>
				</th>
				<th></th>
				<th>
					<Input
						type="search"
						placeholder={'Min Count'}
						onChange={event => debouncedUpdateFilter('minCount', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Max Count'}
						onChange={event => debouncedUpdateFilter('maxCount', event.target.value)}
					></Input>
				</th>
				<th></th>
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
		(prop?: keyof IPlan) => {
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
					<Link href={`/admin/plans/new`}>ADD</Link>
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
					Are you sure you want to delete plan?
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setModalOpened(false);
								if (deleteId) {
									deleteAction(deleteId, queryClient);
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
