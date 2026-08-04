import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IServer } from './definitions';

export class ServersClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/servers?${params}`);
	}
}
export const serversClient = new ServersClient();
