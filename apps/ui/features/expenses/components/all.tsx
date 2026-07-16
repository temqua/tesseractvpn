'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/expenses';
import { expensesClient } from '@/app/lib/api/expenses/client';
import { IExpense } from '@/app/lib/api/expenses/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { debounce } from '@/app/lib/utils';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IExpenseForm {
	id: string;
	paymentDate: string;
	amount: string;
	category: string;
}

const baseColumns: IColumn<IExpense>[] = [
	{
		label: 'ID',
		prop: 'id',
	},
	{
		label: 'Payment Date',
		prop: 'paymentDate',
	},
	{
		label: 'Amount',
		prop: 'amount',
	},
	{
		label: 'Category',
		prop: 'category',
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
	const category = searchParams.get('category');
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
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
	const { data: fetched } = useQuery({
		queryKey: ['expenses', page, take, id, category],
		queryFn: () => {
			const params: IListParams & Partial<IExpenseForm> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (category) params.category = category;
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
					<>
						<Link href={`/expenses/${row.id}`}>✏️</Link>
						<button
							onClick={() => {
								setDeleteId(row.id);
								setModalOpened(true);
							}}
						>
							🗑️
						</button>
					</>
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
				<th></th>
				<th>
					<Select onChange={event => debouncedUpdateFilter('category', event.target.value)}>
						<option value=""></option>
						<option value="Nalog">Nalog</option>
						<option value="Servers">Servers</option>
					</Select>
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
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
				/>
			</ContentArea>
			<div>
				<Dialog
					isOpened={isModalOpened}
					onCancel={() => setModalOpened(false)}
					onClose={() => setModalOpened(false)}
					onConfirm={() => {
						setModalOpened(false);
						if (deleteId) {
							deleteAction(deleteId, queryClient);
						}
					}}
				>
					Are you sure you want to delete expense?
				</Dialog>
			</div>
		</div>
	);
}
