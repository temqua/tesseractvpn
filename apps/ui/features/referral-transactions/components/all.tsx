'use client';

import { Button } from '@/app/components/button';
import ContentArea from '@/app/components/content-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/referral-transactions';
import { referralTransactionsClient } from '@/app/lib/api/referral-transactions/client';
import { IReferralTransaction, IReferralTransactionUI } from '@/app/lib/api/referral-transactions/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

const baseColumns: IColumn<IReferralTransactionUI>[] = [
	{
		label: 'ID',
		prop: 'id',
		searchable: true,
	},
	{
		label: 'Referrer ID',
		prop: 'referrerId',
		searchable: true,
	},
	{
		label: 'Referred ID',
		prop: 'referredId',
		searchable: true,
	},
];
interface IRefTransactionForm {
	id?: string;
	referrerId?: string;
	referredId?: string;
	paymentId?: string;
}

interface IReferralTransactionsPageProps {
	initialData: IReferralTransaction[];
	count?: number;
}

export default function ReferralTransactionsClientSide({ initialData, count }: IReferralTransactionsPageProps) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const userId = searchParams.get('userId');
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
	const columns: IColumn<IReferralTransactionUI>[] = [
		...baseColumns,
		{
			label: 'Actions',
			actions: row => {
				return (
					<>
						<Link href={`/referral-transactions/${row.id}`}>✏️</Link>
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
		queryKey: ['referral-transactions', page, take, id],
		queryFn: () => {
			const params: IListParams & Partial<IRefTransactionForm> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			return referralTransactionsClient.getAll(params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});

	const prepared: IReferralTransactionUI[] =
		fetched?.data.map(u => {
			return {
				id: u.id,
				createdAt: u.createdAt,
				paymentId: u.paymentId,
				referredId: u.referredId,
				referrerId: u.referrerId,
			};
		}) ?? [];

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
				<Table
					searchRow={searchRow}
					columns={columns}
					data={prepared}
					count={fetched?.count ?? 0}
					page={page}
					take={take}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
					loading={isLoading}
				/>
			</ContentArea>
			<Dialog open={isModalOpened}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Confirm</DialogTitle>
					</DialogHeader>
					Are you sure you want to delete referral transaction?
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setModalOpened(false);
								if (deleteId) {
									deleteAction(deleteId, queryClient, id, page, take);
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
