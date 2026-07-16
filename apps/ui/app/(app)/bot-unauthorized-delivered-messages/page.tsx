import UnauthorizedDeliveredMessagesClientSide from '@/features/bot-delivered-messages/components/all';
import { unauthorizedDeliveredMessagesSSRClient } from '@/features/bot-delivered-messages/lib/ssr-client';
import { redirect } from 'next/navigation';

export default async function UnauthorizedDeliveredMessagesPage(props: {
	searchParams: Promise<{
		page?: string;
		take?: string;
		id?: string;
		telegramId?: string;
	}>;
}) {
	const searchParams = await props.searchParams;

	const page = Number(searchParams.page) || 1;
	const take = Number(searchParams.take) || 25;
	const id = searchParams.id || '';
	const telegramId = searchParams.telegramId || '';
	if (!searchParams.page || !searchParams.take) {
		const params = new URLSearchParams();
		params.set('page', page.toString());
		params.set('take', take.toString());
		redirect(`/bot-unauthorized-delivered-messages?${params.toString()}`);
	}
	const response = await unauthorizedDeliveredMessagesSSRClient.getAll({
		skip: (page - 1) * take,
		take,
		...(id && { id }),
		...(telegramId && { telegramId }),
	});
	return <UnauthorizedDeliveredMessagesClientSide initialData={response.data} count={response.count} />;
}
