import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IVPNUser } from './definitions';

export class UsersClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IVPNUser>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/users?${params}`);
	}
}
export const usersClient = new UsersClient();
