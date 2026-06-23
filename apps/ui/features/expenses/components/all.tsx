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
import { debounce } from '@/app/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function ExpensesClientSide({ data, count }: { data: IExpense[]; count: number }) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isModalOpened, setModalOpened] = useState(false);
	const searchParams = useSearchParams();
	const [searchBy, setSearchBy] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

	const [take, setTake] = useState(Number(searchParams.get('take')) || 25);
	const { data: fetched } = useQuery({
		queryKey: ['expenses', page, take, searchBy, searchValue],
		queryFn: () => {
			const params: IListParams = { page, take };
			if (searchBy) {
				params[searchBy] = searchValue;
			}
			return expensesClient.getAll(params);
		},

		placeholderData: page === 1 ? { data, total: data.length } : undefined,
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
	const setFilter = (key: keyof IExpenseForm, value: string, operation?: string) => {
		setSearchBy(key);
		setSearchValue(value);
	};
	const debouncedSetFilter = debounce(setFilter, 1000);
	const searchRow = (
		<>
			<th>
				<Input
					type="search"
					placeholder={'ID'}
					onChange={event => debouncedSetFilter('id', event.target.value)}
				></Input>
			</th>
			<th>
				{/* <Input type="date" placeholder={'Date'} onChange={event => setFilter('paymentDate', event.target.value)}></Input> */}
			</th>
			<th></th>
			<th>
				<Select onChange={event => setFilter('category', event.target.value)}>
					<option value=""></option>
					<option value="Nalog">Nalog</option>
					<option value="Servers">Servers</option>
				</Select>
			</th>
			<th></th>
		</>
	);
	const queryClient = useQueryClient();
	useEffect(() => {
		queryClient.setQueryData(['expenses', page, take, searchBy, searchValue], {
			data,
		});
	}, [data, queryClient]);
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
					count={count}
					data={fetched?.data ?? []}
					onChangePage={input => {
						setPage(input);
					}}
					onChangeTake={input => {
						setTake(input);
					}}
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
