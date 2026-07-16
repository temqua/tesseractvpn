import IncomingMessagesClientSide from '@/features/bot-incoming-messages/components/all';
import { incomingMessagesSSRClient } from '@/features/bot-incoming-messages/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function IncomingMessagesPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		username?: string;
		telegramId?: string;
		firstName?: string;
		lastName?: string;
	}>;
}) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	const username = searchParams.username || '';
	const firstName = searchParams.firstName || '';
	const lastName = searchParams.lastName || '';
	const telegramId = searchParams.telegramId || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		redirect(`/bot-incoming-messages?${params.toString()}`);
	}
	const response = await incomingMessagesSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(firstName && { firstName }),
		...(lastName && { lastName }),
		...(telegramId && { telegramId }),
		...(username && { username }),
	});
	return <IncomingMessagesClientSide initialData={response.data} count={response.count} />;
}
