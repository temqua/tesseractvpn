import { IBotDeliveredMessage } from '@/app/lib/api/bot-unauthorized-delivered-messages/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class UnauthorizedDeliveredMessagesSSRClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotDeliveredMessage>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/bot-unauthorized-delivered-messages?${params}`);
	}

	async getById(id: string): Promise<IBotDeliveredMessage> {
		return await ssrClient.get(`/api/v1/bot-unauthorized-delivered-messages/${id}`);
	}
}
export const unauthorizedDeliveredMessagesSSRClient = new UnauthorizedDeliveredMessagesSSRClient();
