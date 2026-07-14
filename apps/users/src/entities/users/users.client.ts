import client from '../../api-client';
import { ListResponse } from '../../definitions';
import logger from '../../logger';
import { Payment } from '../payments/payments.types';
import { CreateUserDto, UpdateUserDto, UserQueryDto, UserServerDTO, VPNUser } from './users.types';

export class UsersClient {
	async list(dto?: UserQueryDto): Promise<VPNUser[]> {
		const params = new URLSearchParams();
		if (dto?.firstName) {
			params.append('firstName', dto.firstName);
		}
		if (dto?.username) {
			params.append('username', dto.username);
		}
		if (dto?.orderBy) {
			params.append('orderBy', dto.orderBy);
		}
		if (dto?.orderDirection) {
			params.append('orderDirection', dto.orderDirection);
		}
		if (dto?.telegramId) {
			params.append('telegramId', dto.telegramId);
		}
		if (dto?.expiresAfterDays !== undefined) {
			params.append('expiresAfterDays', dto.expiresAfterDays.toString());
		}
		if (dto?.trial !== undefined) {
			params.append('trial', dto.trial.toString());
		}
		if (dto?.active !== undefined) {
			params.append('active', dto.active.toString());
		}
		if (dto?.free !== undefined) {
			params.append('free', dto.free.toString());
		}
		const result = (await client.get(`/users?${params}`)) as ListResponse<VPNUser>;
		return result?.data;
	}

	async getByTelegramId(telegramId: string | number): Promise<VPNUser | null> {
		const params = new URLSearchParams();
		params.append('telegramId', telegramId.toString());
		const result = (await client.get(`/users?${params}`)) as ListResponse<VPNUser>;
		if (!result?.data?.length) {
			return null;
		}
		return result?.data[0];
	}

	async getById(id: number): Promise<VPNUser> {
		const result = await client.get(`/users/${id}`);
		return result as VPNUser;
	}

	async getByUsername(username: string): Promise<VPNUser> {
		const params = new URLSearchParams();
		params.append('username', username);
		const result = (await client.get(`/users?${params}`)) as ListResponse<VPNUser>;
		return result.data[0];
	}

	async getUnpaid(): Promise<VPNUser[]> {
		const result = await client.get('/users/unpaid');
		return <VPNUser[]>result;
	}

	async getTrial(): Promise<VPNUser[]> {
		const result = await client.get('/users/trial');
		return <VPNUser[]>result;
	}

	async getLastPayment(id: number): Promise<Payment | null> {
		let result = null;
		try {
			result = await client.get(`/users/${id}/payments/last`);
		} catch (err) {
			logger.error(err);
		}
		return <Payment | null>result;
	}

	async create(dto: CreateUserDto): Promise<VPNUser | null> {
		const result = await client.post(`/users`, {
			body: JSON.stringify(dto),
		});
		return <VPNUser | null>result;
	}

	async update(id: number, dto: UpdateUserDto): Promise<VPNUser> {
		const result = await client.patch(`/users/${id}`, {
			body: JSON.stringify(dto),
		});
		return <VPNUser>result;
	}

	async delete(id: number) {
		const result = await client.delete(`/users/${id}`);
		return result;
	}

	async getUserServers(userId: number) {
		const result = await client.get(`/users/${userId}/servers`);
		return <UserServerDTO[]>result;
	}

	async createSubscription(userId: string) {
		const result = await client.post(`/users/${userId}/subscription`);
		return <VPNUser>result;
	}

	async deleteSubscription(userId: string) {
		const result = await client.delete(`/users/${userId}/subscription`);
		return <VPNUser>result;
	}

	async export() {
		return await client.post('/users/export');
	}

	async createAction(userId: string | number, command: string, action: string) {
		return await client.post(`/users/${userId}/actions`, {
			body: JSON.stringify({
				command,
				action,
			}),
		});
	}

	async captureDelivery(userId: string | number, message: string) {
		return await client.post(`/users/${userId}/delivered-messages`, {
			body: JSON.stringify({
				message,
			}),
		});
	}
}
