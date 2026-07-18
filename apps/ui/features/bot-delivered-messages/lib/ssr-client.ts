import { IBotDeliveredMessageDTO } from '@/app/lib/api/bot-delivered-messages/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class DeliveredMessagesSSRClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotDeliveredMessageDTO>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/bot-delivered-messages?${params}`);
	}

	async getById(id: string): Promise<IBotDeliveredMessageDTO> {
		return await ssrClient.get(`/api/v1/bot-delivered-messages/${id}`);
	}
}
export const deliveredMessagesSSRClient = new DeliveredMessagesSSRClient();
