'use client';
import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { paymentsClient } from '@/app/lib/api/payments/client';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

const baseColumns: IColumn<IPayment>[] = [
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
		sortable: true,
	},
	{
		label: 'Months count',
		prop: 'monthsCount',
		sortable: true,
	},
	{
		label: 'Expires on',
		prop: 'expiresOn',
		sortable: true,
	},
];

interface IUserPaymentForm {
	id?: string;
	paymentDate?: string;
	amount?: string;
	monthsCount?: string;
	expiresOn?: string;
}

interface IUserPaymentsPageProps {
	initialData: IPayment[];
	count?: number;
}

interface IUserPaymentFormWithOrder extends IUserPaymentForm {
	orderBy?: keyof IUserPaymentForm;
	orderDirection?: OrderDirection;
}

export function UserPaymentsClientSide({ initialData, count }: IUserPaymentsPageProps) {
	const searchParams = useSearchParams();

	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const monthsCount = searchParams.get('monthsCount');
	const amount = searchParams.get('amount');
	const orderBy = (searchParams.get('orderBy') as keyof IUserPaymentForm) || '';
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
		queryKey: ['user-payments', page, take, id, monthsCount, orderBy, orderDirection, amount],
		queryFn: () => {
			const params: IListParams & Partial<IUserPaymentFormWithOrder> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (monthsCount) params.monthsCount = monthsCount;
			if (amount) params.amount = amount;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
			return paymentsClient.getForUser(params);
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
						placeholder="Months Count"
						defaultValue={monthsCount ?? undefined}
						onChange={e => debouncedUpdateFilter('monthsCount', e.target.value)}
					/>
				</th>
				<th></th>
			</>
		),
		[debouncedUpdateFilter],
	);

	const handleSort = useCallback(
		(prop?: keyof IPayment) => {
			if (!prop) {
				return;
			}
			const newDirection = orderDirection ? (orderDirection === 'asc' ? 'desc' : 'asc') : 'asc';
			updateParams({ orderBy: prop, orderDirection: newDirection });
		},
		[orderDirection],
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
	return (
		<ContentArea>
			<Table
				searchRow={searchRow}
				columns={baseColumns}
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
	);
}
