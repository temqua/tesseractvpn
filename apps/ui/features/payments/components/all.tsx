'use client';

import ActionsCell from '@/app/components/actions-cell';
import { Button } from '@/app/components/button';
import { Calendar } from '@/app/components/calendar';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '@/app/components/combobox';
import ContentArea from '@/app/components/content-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/dialog';
import { Input } from '@/app/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/popover';
import Table, { IColumn } from '@/app/components/table';
import { deleteAction } from '@/app/lib/actions/payments';
import { paymentsClient } from '@/app/lib/api/payments/client';
import { IPayment } from '@/app/lib/api/payments/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { formatISODate } from '@/app/lib/utils';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

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
	{
		label: 'User',
		prop: 'userId',
	},
	{
		label: 'Plan',
		prop: 'planId',
	},
	{
		label: 'parentPaymentId',
		prop: 'parentPaymentId',
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
	from?: string;
	to?: string;
}

interface IPaymentsPageProps {
	initialData: IPayment[];
	count?: number;
	users: {
		label: string;
		value: string;
	}[];
	plans: {
		label: string;
		value: string;
	}[];
}

interface IPaymentFormWithOrder extends IPaymentForm {
	orderBy?: keyof IPaymentForm;
	orderDirection?: OrderDirection;
}

export default function PaymentsClientSide({ initialData, count, users, plans }: IPaymentsPageProps) {
	const [isModalOpened, setModalOpened] = useState(false);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const userId = searchParams.get('userId');
	const planId = searchParams.get('planId');
	const from = searchParams.get('from') ?? undefined;
	const to = searchParams.get('to') ?? undefined;
	const expiresOn = searchParams.get('expiresOn');
	const monthsCount = searchParams.get('monthsCount');
	const amount = searchParams.get('amount');
	const orderBy = (searchParams.get('orderBy') as keyof IPaymentForm) || '';
	const orderDirection = (searchParams.get('orderDirection') as OrderDirection) || '';
	const [isPaymentDateOpened, setPaymentDateOpened] = useState(false);
	const [isExpiresOnOpened, setExpiresOnOpened] = useState(false);
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
					<ActionsCell>
						<Link href={`/admin/payments/${row.id}`}>
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

	const { data: fetched, isLoading } = useQuery({
		queryKey: [
			'payments',
			page,
			take,
			id,
			userId,
			monthsCount,
			orderBy,
			orderDirection,
			amount,
			planId,
			from,
			to,
			expiresOn,
		],
		queryFn: () => {
			const params: IListParams & Partial<IPaymentFormWithOrder> = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (userId) params.userId = userId;
			if (planId) params.planId = planId;
			if (monthsCount) params.monthsCount = monthsCount;
			if (from) params.from = from;
			if (to) params.to = to;
			if (amount) params.amount = amount;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
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
				<th>
					<Popover open={isPaymentDateOpened} onOpenChange={setPaymentDateOpened}>
						<PopoverTrigger
							render={
								<Button variant="outline" id="date" className="justify-start w-full">
									<CalendarIcon data-icon="inline-start" />
									{from ? (
										to ? (
											<>
												{formatISODate(from)} - {formatISODate(to)}
											</>
										) : (
											<>{formatISODate(from)}</>
										)
									) : (
										<span>Select date</span>
									)}
								</Button>
							}
						/>
						<PopoverContent className="w-auto overflow-hidden p-0" align="start">
							<Calendar
								mode="range"
								selected={{
									from: from ? parseISO(from) : undefined,
									to: to ? parseISO(to) : undefined,
								}}
								defaultMonth={from ? parseISO(from) : undefined}
								captionLayout="dropdown"
								onSelect={date => {
									if (date?.from && date?.to) {
										updateParams({
											from: formatISODate(date.from),
											to: formatISODate(date.to),
											page: 1,
										});
									}
								}}
							/>
						</PopoverContent>
					</Popover>
				</th>
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
				<th>
					<Combobox
						items={users}
						value={userId ?? undefined}
						onValueChange={v => {
							debouncedUpdateFilter('userId', v ?? '');
						}}
					>
						<ComboboxInput placeholder="Select user"></ComboboxInput>
						<ComboboxContent>
							<ComboboxEmpty>No users found.</ComboboxEmpty>
							<ComboboxList>
								{item => (
									<ComboboxItem key={item.value} value={item.value}>
										{item.label}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</th>
				<th>
					<Combobox
						items={plans}
						value={planId ?? undefined}
						onValueChange={v => {
							debouncedUpdateFilter('planId', v ?? '');
						}}
					>
						<ComboboxInput placeholder="Select plan"></ComboboxInput>
						<ComboboxContent>
							<ComboboxEmpty>No plans found.</ComboboxEmpty>
							<ComboboxList>
								{item => (
									<ComboboxItem key={item.value} value={item.value}>
										{item.label}
									</ComboboxItem>
								)}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</th>
				<th></th>
				<th></th>
			</>
		),
		[debouncedUpdateFilter, from, to, isPaymentDateOpened],
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
	const queryClient = useQueryClient();
	return (
		<div>
			<ContentArea>
				<div>
					<Link href={`/admin/payments/new`}>ADD</Link>
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
					onSort={handleSort}
					loading={isLoading}
					gridTemplateColumns={`1fr 1fr 1fr 1fr 1fr 200px 200px 1fr 1fr`}
				/>
			</ContentArea>
			<Dialog open={isModalOpened}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Confirm</DialogTitle>
					</DialogHeader>
					Are you sure you want to delete payment?
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
