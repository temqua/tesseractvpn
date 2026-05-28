'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import { Select } from '@/app/components/select';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/expenses';
import { IExpense } from '@/app/lib/api/expenses/definitions';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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
		searchable: true,
	},
	{
		label: 'Payment Date',
		prop: 'paymentDate',
		searchable: true,
	},
	{
		label: 'Amount',
		prop: 'amount',
		searchable: true,
	},
	{
		label: 'Category',
		prop: 'category',
	},
];

export default function ExpensesClientSide({ data }: { data: IExpense[] }) {
	const [searchFilters, setSearchFilters] = useState<IExpenseForm>({
		id: '',
		paymentDate: '',
		amount: '',
		category: '',
	});
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isModalOpened, setModalOpened] = useState(false);
	queryClient.setQueryData(['expenses-all'], data);

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
	const setFilter = (key: keyof IExpenseForm, value: string) => {
		setSearchFilters(prev => ({
			...prev,
			[key]: value,
		}));
	};
	// const { error, data } = useSuspenseQuery({
	//     queryKey: ['expenses-all'],
	//     queryFn: () => expensesClient.getAll(),
	// });
	// if (error) {
	//     return (
	//         <div>
	//             <ContentArea>Error: {error.message}</ContentArea>
	//         </div>
	//     );
	// }
	const filteredData = useMemo(() => {
		return data.filter(row => {
			return (
				String(row.id).includes(searchFilters.id) &&
				String(row.paymentDate).toLowerCase().includes(searchFilters.paymentDate.toLowerCase()) &&
				String(row.amount).includes(searchFilters.amount) &&
				String(row.category).toLowerCase().includes(searchFilters.category.toLowerCase())
			);
		});
	}, [data, searchFilters]);
	const searchRow = (
		<>
			{columns
				.filter(c => c.searchable)
				.map(c => (
					<th key={c.prop ?? c.label}>
						<Input
							type="search"
							placeholder={c.label}
							onChange={event => setFilter(c.prop as keyof IExpenseForm, event.target.value)}
						></Input>
					</th>
				))}
			<th>
				<Select onChange={event => setFilter('category', event.target.value)}>
					<option value=""></option>
					<option value="nalog">Nalog</option>
					<option value="servers">Servers</option>
				</Select>
			</th>
			<th></th>
		</>
	);
	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/expenses/new`}>ADD</Link>
				</div>
				<Table searchRow={searchRow} columns={columns} data={filteredData} />
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
