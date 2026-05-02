'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ContentArea from '../../components/content-area';
import Table, { IColumn } from '../../components/table';
import { expensesClient } from '../../lib/api/expenses/client';
import { IExpense } from '../../lib/api/expenses/definitions';
import { Input } from '../../components/input';
import { useMemo, useState } from 'react';
import { Select } from '../../components/select';
import Dialog from '../../components/dialog';
import { Button } from '../../components/button';

export default function ExpensesPage() {
	const [searchFilters, setSearchFilters] = useState({
		id: '',
		paymentDate: '',
		amount: '',
		category: '',
	});
	const [open, setOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const columns: IColumn<IExpense>[] = [
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
		{
			label: 'Actions',
			actions: row => {
				return (
					<>
						<Link href={`/expenses/${row.id}`}>✏️</Link>
						<button
							onClick={() => {
								setDeleteId(row.id);
								setOpen(true);
							}}
						>
							🗑️
						</button>
					</>
				);
			},
		},
	];
	const setFilter = (key: keyof typeof searchFilters, value: string) => {
		setSearchFilters(prev => ({
			...prev,
			[key]: value,
		}));
	};
	const { error, data } = useSuspenseQuery({
		queryKey: ['expenses-all'],
		queryFn: () => expensesClient.getAll(),
	});
	if (error) {
		return (
			<div>
				<ContentArea>Error: {error.message}</ContentArea>
			</div>
		);
	}
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
							onChange={event => setFilter(c.prop, event.target.value)}
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
				<Table searchRow={searchRow} columns={columns} data={filteredData} />
			</ContentArea>
			<div>
				<Dialog open={open} onClose={() => setOpen(false)}>
					<h2>Подтверждение</h2>
					<p>Удалить?</p>
					<Button
						onClick={() => {
							setOpen(false);
						}}
					>
						Да
					</Button>
					<Button onClick={() => setOpen(false)}>Нет</Button>
				</Dialog>
			</div>
		</div>
	);
}
