'use client';
import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IBotDeliveredMessageDTO } from './definitions';

export class BotDeliveredMessagesClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotDeliveredMessageDTO>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/bot-delivered-messages?${params}`);
	}

	async getById(id: string): Promise<IBotDeliveredMessageDTO> {
		return await apiClient.get(`/api/v1/bot-delivered-messages/${id}`);
	}
}
export const deliveredMessagesClient = new BotDeliveredMessagesClient();
