'use client';

import ContentArea from '@/app/components/content-area';
import Dialog from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/payments';
import { paymentsClient } from '@/app/lib/api/payments/client';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

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

interface IPaymentsPageProps {
	initialData: IPayment[];
	count?: number;
}

export default function PaymentsClientSide({ initialData, count }: IPaymentsPageProps) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const userId = searchParams.get('userId');
	const monthsCount = searchParams.get('monthsCount');
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

	const { data: fetched, isLoading } = useQuery({
		queryKey: ['payments', page, take, id, userId, monthsCount],
		queryFn: () => {
			const params: IListParams & Partial<IPaymentForm> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (userId) params.userId = userId;
			if (monthsCount) params.monthsCount = monthsCount;
			return paymentsClient.getAll(params);
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
						onChange={event => debouncedUpdateFilter('id', event.target.value)}
					></Input>
				</th>
				<th></th>
				<th></th>
				<th>
					<Input
						type="search"
						placeholder="Months Count"
						defaultValue={monthsCount}
						onChange={e => debouncedUpdateFilter('monthsCount', e.target.value)}
					/>
				</th>
				<th></th>
				<th>
					<Input
						type="search"
						placeholder="User ID"
						defaultValue={userId}
						onChange={e => debouncedUpdateFilter('userId', e.target.value)}
					/>
				</th>
				<th></th>
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
	const queryClient = useQueryClient();
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
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
					loading={isLoading}
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
