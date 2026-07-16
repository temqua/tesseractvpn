import { IBotIncomingMessage } from '@/app/lib/api/bot-incoming-messages/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class IncomingMessagesSSRClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotIncomingMessage>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/bot-incoming-messages?${params}`);
	}

	async getById(id: string): Promise<IBotIncomingMessage> {
		return await ssrClient.get(`/api/v1/bot-incoming-messages/${id}`);
	}
}
export const incomingMessagesSSRClient = new IncomingMessagesSSRClient();
