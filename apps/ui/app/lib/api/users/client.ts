import apiClient from '../api-client';

export class UsersClient {
	async getAll() {
		return await apiClient.get('/api/v1/users');
	}
}
export const usersClient = new UsersClient();
