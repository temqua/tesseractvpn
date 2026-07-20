import ssrClient from '@/app/lib/api/ssr-client';
import { IVPNUser, IVPNUserDTO, IVPNUserListDTO } from '@/app/lib/api/users/definitions';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class UsersSSRClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IVPNUserListDTO>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/users?${params}`);
	}

	async getById(id: string): Promise<IVPNUserDTO> {
		return await ssrClient.get(`/api/v1/users/${id}`);
	}
}
export const usersSSRClient = new UsersSSRClient();
