import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IUserServer } from './definitions';

export class UsersServersClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IUserServer>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/users-servers?${params}`);
	}
}
export const usersServersClient = new UsersServersClient();
