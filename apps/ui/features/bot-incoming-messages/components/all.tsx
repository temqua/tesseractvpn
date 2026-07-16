'use client';
import ContentArea from '@/app/components/content-area';
import { Input } from '@/app/components/input';
import Table, { IColumn } from '@/app/components/table';
import { incomingMessagesClient } from '@/app/lib/api/bot-incoming-messages/client';
import { IBotIncomingMessage } from '@/app/lib/api/bot-incoming-messages/definitions';
import { IListParams } from '@/app/lib/definitions.global';
import { useUpdateParams } from '@/app/lib/use-update-params';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef } from 'react';

interface IIncomingMessagesPageProps {
	count: number;
	initialData: IBotIncomingMessage[];
}

const baseColumns: IColumn<IBotIncomingMessage>[] = [
	{
		label: 'ID',
		prop: 'id',
		searchable: true,
	},
	{
		label: 'Text',
		prop: 'text',
	},
	{
		label: 'Telegram ID',
		prop: 'telegramId',
		searchable: true,
	},
	{
		label: 'Username',
		prop: 'username',
		searchable: true,
	},
	{
		label: 'First name',
		prop: 'firstName',
		searchable: true,
	},
	{
		label: 'Last name',
		prop: 'lastName',
		searchable: true,
	},
	{
		label: 'Created At',
		prop: 'createdAt',
	},
];

export default function IncomingMessagesClientSide({ initialData, count }: IIncomingMessagesPageProps) {
	const searchParams = useSearchParams();
	const id = searchParams.get('id') || '';
	const username = searchParams.get('username') || '';
	const firstName = searchParams.get('firstName') || '';
	const lastName = searchParams.get('lastName') || '';
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
		queryKey: ['bot-incoming-messages', page, take, id, username, firstName, lastName, telegramId],
		queryFn: () => {
			const params: IListParams & Record<string, string> = { skip: (page - 1) * take, take } as any;
			if (id) params.id = id;
			if (username) params.username = username;
			if (firstName) params.firstName = firstName;
			if (lastName) params.lastName = lastName;
			if (telegramId) params.telegramId = lastName;
			return incomingMessagesClient.getAll(params);
		},
		placeholderData: keepPreviousData,
		initialData: page === 1 ? { data: initialData, count: count ?? 0 } : undefined,
	});
	const columns: IColumn<IBotIncomingMessage>[] = [...baseColumns];
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
				<th>
					<Input
						type="search"
						placeholder={'Username'}
						onChange={event => debouncedUpdateFilter('username', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'First name'}
						onChange={event => debouncedUpdateFilter('firstName', event.target.value)}
					></Input>
				</th>
				<th>
					<Input
						type="search"
						placeholder={'Last name'}
						onChange={event => debouncedUpdateFilter('lastName', event.target.value)}
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
