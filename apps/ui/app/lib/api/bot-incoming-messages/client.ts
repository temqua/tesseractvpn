'use client';
import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IBotIncomingMessage } from './definitions';

export class BotIncomingMessagesClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IBotIncomingMessage>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/bot-incoming-messages?${params}`);
	}

	async getById(id: string): Promise<IBotIncomingMessage> {
		return await apiClient.get(`/api/v1/bot-incoming-messages/${id}`);
	}
}
export const incomingMessagesClient = new BotIncomingMessagesClient();
