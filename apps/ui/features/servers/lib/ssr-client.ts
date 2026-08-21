import { IServer } from '@/app/lib/api/servers/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IUserServer } from '@/app/lib/api/users-servers/definitions';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class ServersSSRClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/servers?${params}`);
	}

	async getById(id: string): Promise<IServer> {
		return await ssrClient.get(`/api/v1/servers/${id}`);
	}

	async getUsers(id: string, listParams?: IListParams): Promise<ListResponse<IUserServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);

		return await ssrClient.get(`/api/v1/servers/${id}/users?${params}`);
	}
}
export const serversSSRClient = new ServersSSRClient();
