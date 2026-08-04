import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IServer, IUpdateServerDto } from './definitions';

export class ServersClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/servers?${params}`);
	}

	async update(id: string, dto: IUpdateServerDto) {
		return await apiClient.patch(`/api/v1/servers/${id}`, {
			body: JSON.stringify(dto),
		});
	}
	async delete(id: string) {
		return await apiClient.delete(`/api/v1/servers/${id}`);
	}
}
export const serversClient = new ServersClient();
