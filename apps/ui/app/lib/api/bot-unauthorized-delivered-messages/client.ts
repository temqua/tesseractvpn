'use client';
import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IBotDeliveredMessage } from './definitions';

export class BotUnauthorizedDeliveredMessagesClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotDeliveredMessage>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/bot-unauthorized-delivered-messages?${params}`);
	}

	async getById(id: string): Promise<IBotDeliveredMessage> {
		return await apiClient.get(`/api/v1/bot-unauthorized-delivered-messages/${id}`);
	}
}
export const unauthorizedDeliveredMessagesClient = new BotUnauthorizedDeliveredMessagesClient();
