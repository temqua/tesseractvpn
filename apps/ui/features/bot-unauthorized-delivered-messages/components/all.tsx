'use client';

import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { unauthorizedDeliveredMessagesClient } from '@/app/lib/api/bot-unauthorized-delivered-messages/client';
import { IBotUnauthorizedDeliveredMessage } from '@/app/lib/api/bot-unauthorized-delivered-messages/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { OrderDirection } from '@/app/lib/enums';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

interface IUnauthorizedDeliveredMessagesPageProps {
	count: number;
	initialData: IBotUnauthorizedDeliveredMessage[];
}

const baseColumns: IColumn<IBotUnauthorizedDeliveredMessage>[] = [
	{
		label: 'ID',
		prop: 'id',
		sortable: true,
	},
	{
		label: 'Message',
		prop: 'message',
	},
	{
		label: 'Telegram ID',
		prop: 'telegramId',
		sortable: true,
	},
	{
		label: 'Created At',
		prop: 'createdAt',
		sortable: true,
	},
];

interface IBotUnauthorizedMessageForm {
	id?: string;
	telegramId?: string;
	createAt?: string;
}

interface IBotUnauthorizedMessageFormWithOrder extends IBotUnauthorizedMessageForm {
	orderBy?: keyof IBotUnauthorizedMessageForm;
	orderDirection?: OrderDirection;
}

export default function UnauthorizedDeliveredMessagesClientSide({
	initialData,
	count,
}: IUnauthorizedDeliveredMessagesPageProps) {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const telegramId = searchParams.get('telegramId') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
	const orderBy = (searchParams.get('orderBy') as keyof IBotUnauthorizedMessageForm) || '';
	const orderDirection = (searchParams.get('orderDirection') as OrderDirection) || '';
	const updateParams = useUpdateParams(useRouter(), usePathname());
	const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const debouncedUpdateFilter = useCallback(
		(key: string, value: string) => {
			if (debounceTimer.current) clearTimeout(debounceTimer.current);
			debounceTimer.current = setTimeout(() => {
				updateParams({ [key]: value, page: 1 }); // сброс ст>раницы при новом фильтре
			}, 500);
		},
		[updateParams],
	);
	const { data: fetched, isLoading } = useQuery({
		queryKey: ['bot-unauthorized-delivered-messages', page, take, id, telegramId, orderBy, orderDirection],
		queryFn: () => {
			const params: IListParams & IBotUnauthorizedMessageFormWithOrder = { skip: (page - 1) * take, take };
			if (id) params.id = id;
			if (telegramId) params.telegramId = telegramId;
			if (orderBy) params.orderBy = orderBy;
			if (orderDirection) params.orderDirection = orderDirection;
			return unauthorizedDeliveredMessagesClient.getAll(params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});
	const columns: IColumn<IBotUnauthorizedDeliveredMessage>[] = [...baseColumns];
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
						placeholder={'Telegram ID'}
						onChange={event => debouncedUpdateFilter('telegramId', event.target.value)}
					></Input>
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
	const handleSort = useCallback(
		(prop?: keyof IBotUnauthorizedDeliveredMessage) => {
			if (!prop) {
				return;
			}
			const newDirection = orderDirection ? (orderDirection === 'asc' ? 'desc' : 'asc') : 'asc';
			updateParams({ orderBy: prop, orderDirection: newDirection });
		},
		[orderDirection],
	);
	return (
		<div>
			<ContentArea>
				<Table
					loading={isLoading}
					page={page}
					take={take}
					searchRow={searchRow}
					columns={columns}
					count={fetched?.count ?? 0}
					data={fetched?.data ?? []}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
					onSort={handleSort}
				/>
			</ContentArea>
		</div>
	);
}
