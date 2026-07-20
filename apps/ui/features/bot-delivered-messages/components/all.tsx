'use client';

import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { deliveredMessagesClient } from '@/app/lib/api/bot-delivered-messages/client';
import { IBotDeliveredMessageUI } from '@/app/lib/api/bot-delivered-messages/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

interface IDeliveredMessagesPageProps {
	count: number;
	initialData: IBotDeliveredMessageUI[];
}

const baseColumns: IColumn<IBotDeliveredMessageUI>[] = [
	{
		label: 'ID',
		prop: 'id',
		searchable: true,
	},
	{
		label: 'Message',
		prop: 'message',
	},
	{
		label: 'User ID',
		prop: 'userId',
	},
	{
		label: 'Username',
		prop: 'username',
	},
	{
		label: 'Created At',
		prop: 'createdAt',
	},
	// {
	// 	label: 'Telegram ID',
	// 	prop: 'user.telegramId',
	// 	searchable: true,
	// },
];

export default function DeliveredMessagesClientSide({ initialData, count }: IDeliveredMessagesPageProps) {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const telegramId = searchParams.get('telegramId') || '';
	const page = Number(searchParams.get('page')) || 1;
	const take = Number(searchParams.get('take')) || 25;
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
	const { data: fetched } = useQuery({
		queryKey: ['bot-delivered-messages', page, take, id, telegramId],
		queryFn: () => {
			const params: IListParams & Record<string, string> = { skip: (page - 1) * take, take } as any;
			if (id) params.id = id;
			// if (telegramId) params.telegramId = telegramId;
			return deliveredMessagesClient.getAll(params).then(r => {
				return {
					...r,
					data: r.data.map(
						record =>
							({
								id: record.id,
								message: record.message,
								userId: record.userId,
								createdAt: record.createdAt,
								username: record.user.username,
							}) as IBotDeliveredMessageUI,
					),
				};
			});
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});

	const columns: IColumn<IBotDeliveredMessageUI>[] = [...baseColumns];
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
				<th></th>
				{/* <th>
					<Input
						type="search"
						placeholder={'Telegram ID'}
						onChange={event => debouncedUpdateFilter('telegramId', event.target.value)}
					></Input>
				</th> */}
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
	return (
		<div>
			<ContentArea>
				<Table
					page={page}
					take={take}
					searchRow={searchRow}
					columns={columns}
					count={fetched?.count ?? 0}
					data={fetched?.data ?? []}
					onChangePage={handlePageChange}
					onChangeTake={handleTakeChange}
				/>
			</ContentArea>
		</div>
	);
}
