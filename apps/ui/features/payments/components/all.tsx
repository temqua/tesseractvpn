'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/payments';
import { paymentsClient } from '@/app/lib/api/payments/client';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { debounce } from '@/app/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const baseColumns: IColumn<IPayment>[] = [
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
		label: 'Months count',
		prop: 'monthsCount',
		searchable: true,
	},
	{
		label: 'Expires on',
		prop: 'expiresOn',
		searchable: true,
	},
	{
		label: 'userId',
		prop: 'userId',
		searchable: true,
	},
	{
		label: 'planId',
		prop: 'planId',
		searchable: true,
	},
	{
		label: 'parentPaymentId',
		prop: 'parentPaymentId',
		searchable: true,
	},
];
interface IPaymentForm {
	id?: string;
	paymentDate?: string;
	amount?: string;
	monthsCount?: string;
	expiresOn?: string;
	userId?: string;
	planId?: string;
	parentPaymentId?: string;
}

export default function PaymentsClientSide({ data, count }: { data: IPayment[]; count: number }) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	const searchParams = useSearchParams();
	const [searchBy, setSearchBy] = useState('' as keyof IPaymentForm);
	const [searchValue, setSearchValue] = useState('');
	const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
	const setFilter = (key: keyof IPaymentForm, value: string) => {
		setSearchBy(key);
		setSearchValue(value);
	};
	const debouncedSetFilter = debounce(setFilter, 1000);
	const [take, setTake] = useState(Number(searchParams.get('take')) || 25);
	const columns: IColumn<IPayment>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<>
						<Link href={`/payments/${row.id}`}>✏️</Link>
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
	const { data: fetched } = useQuery({
		queryKey: ['payments', page, take, searchBy, searchValue],
		queryFn: () => {
			const params: IListParams & Partial<IPaymentForm> = { skip: (page - 1) * take, take };
			if (searchBy) {
				params[searchBy] = searchValue;
			}
			return paymentsClient.getAll(params);
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
			{columns
				.filter(c => c.prop !== 'id')
				.map(c => (
					<th key={c.prop}></th>
				))}
		</>
	);
	const queryClient = useQueryClient();
	useEffect(() => {
		queryClient.setQueryData(['payments', page, take, searchBy, searchValue], {
			data,
			count,
		});
	}, [data, count]);
	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/payments/new`}>ADD</Link>
				</div>
				<Table
					searchRow={searchRow}
					columns={columns}
					data={fetched?.data ?? []}
					count={fetched?.count ?? 0}
					page={page}
					take={take}
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
					Are you sure you want to delete payment?
				</Dialog>
			</div>
		</div>
	);
}
