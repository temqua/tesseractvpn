'use client';

import ActionsCell from '@/app/components/actions-cell';
import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/expenses';
import { expensesClient } from '@/app/lib/api/expenses/client';
import { IExpense } from '@/app/lib/api/expenses/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

interface IExpenseForm {
	id: string;
	paymentDate: string;
	amount: string;
	category: string;
}

interface IExpenseFormWithOrder extends IExpenseForm {
	orderBy?: keyof IExpenseForm;
	orderDirection?: OrderDirection;
}

const baseColumns: IColumn<IExpense>[] = [
	{
		label: 'ID',
		prop: 'id',
	},
	{
		label: 'Payment Date',
		prop: 'paymentDate',
		sortable: true,
	},
	{
		label: 'Amount',
		prop: 'amount',
	},
	{
		label: 'Category',
		prop: 'category',
	},
	{
		label: 'Description',
		prop: 'description',
	},
];

interface IExpensePageProps {
	initialData: IExpense[];
	count?: number;
}

export default function ExpensesClientSide({ initialData, count }: IExpensePageProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isModalOpened, setModalOpened] = useState(false);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const amount = searchParams.get('amount');
	const category = searchParams.get('category');
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const orderBy = (searchParams.get('orderBy') as keyof IExpenseForm) || '';
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
	const { data: fetched, isLoading } = useQuery({
		queryKey: ['expenses', page, take, id, category, orderBy, orderDirection, amount],
		queryFn: () => {
			const params: IListParams & Partial<IExpenseFormWithOrder> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (category) params.category = category;
			if (amount) params.amount = amount;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;

			return expensesClient.getAll(params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});
	const columns: IColumn<IExpense>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<ActionsCell>
						<Link href={`/expenses/${row.id}`}>
							<Pencil />
						</Link>
						<button
							onClick={() => {
								setDeleteId(row.id);
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
	const searchRow = useMemo(
		() => (
			<>
				<th>
					<Input
						type="search"
						placeholder={'ID'}
						onChange={event => debouncedUpdateFilter('id', event.target.value)}
					></Input>
				</th>
				<th>
					{/* <Input type="date" placeholder={'Date'} onChange={event => setFilter('paymentDate', event.target.value)}></Input> */}
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Amount'}
						onChange={event => debouncedUpdateFilter('amount', event.target.value)}
					></Input>
				</th>
				<th>
					<Select onChange={event => debouncedUpdateFilter('category', event.target.value)}>
						<option value=""></option>
						<option value="Nalog">Nalog</option>
						<option value="Servers">Servers</option>
					</Select>
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
		(prop?: keyof IExpense) => {
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
					<Link href={`/expenses/new`}>ADD</Link>
				</div>
				<Table
					page={page}
					take={take}
					searchRow={searchRow}
					columns={columns}
					count={fetched?.count ?? 0}
					data={fetched?.data ?? []}
					loading={isLoading}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
					onSort={handleSort}
				/>
			</ContentArea>
			<Dialog open={isModalOpened}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Confirm</DialogTitle>
					</DialogHeader>
					Are you sure you want to delete expense?
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
