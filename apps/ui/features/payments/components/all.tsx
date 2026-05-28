'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/payments';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo, useState } from 'react';

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

export default function PaymentsClientSide({ data }: { data: IPayment[] }) {
	const [searchFilters, setSearchFilters] = useState<Partial<IPaymentForm>>({
		id: '',
		paymentDate: '',
		amount: '',
		monthsCount: '',
		expiresOn: '',
		userId: '',
		planId: '',
		parentPaymentId: '',
	});
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const queryClient = useQueryClient();
	queryClient.setQueryData(['payments-all'], data);
	const setFilter = (key: keyof IPaymentForm, value: string) => {
		setSearchFilters(prev => ({
			...prev,
			[key]: value,
		}));
	};
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
	const filteredData = useMemo(() => {
		return data.filter(row => {
			return (
				String(row.id).includes(searchFilters.id) &&
				String(row.paymentDate).toLowerCase().includes(searchFilters.paymentDate.toLowerCase()) &&
				String(row.amount).includes(searchFilters.amount) &&
				String(row.monthsCount).includes(searchFilters.monthsCount) &&
				String(row.expiresOn).includes(searchFilters.expiresOn) &&
				String(row.userId).includes(searchFilters.userId) &&
				String(row.planId).includes(searchFilters.planId) &&
				String(row.parentPaymentId).includes(searchFilters.parentPaymentId)
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
							onChange={event => setFilter(c.prop as keyof IPaymentForm, event.target.value)}
						></Input>
					</th>
				))}
			<th></th>
		</>
	);
	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/payments/new`}>ADD</Link>
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
					Are you sure you want to delete payment?
				</Dialog>
			</div>
		</div>
	);
}
