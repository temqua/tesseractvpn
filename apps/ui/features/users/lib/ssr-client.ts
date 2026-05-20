import ssrClient from '@/app/lib/api/ssr-client';
import { IVPNUser } from '@/app/lib/api/users/definitions';

export class UsersSSRClient {
	async getAll(): Promise<IVPNUser[]> {
		return await ssrClient.get('/api/v1/users');
	}

	async getById(id: string): Promise<IVPNUser> {
		return await ssrClient.get(`/api/v1/users/${id}`);
	}
}
export const usersSSRClient = new UsersSSRClient();
