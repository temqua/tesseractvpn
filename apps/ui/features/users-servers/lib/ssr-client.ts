import ssrClient from '@/app/lib/api/ssr-client';
import { IUserServer } from '@/app/lib/api/users-servers/definitions';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class UsersServersSSRClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IUserServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/users-servers?${params}`);
	}

	async getById(id: string): Promise<IUserServer> {
		return await ssrClient.get(`/api/v1/users-servers/${id}`);
	}
}
export const usersServersSSRClient = new UsersServersSSRClient();
