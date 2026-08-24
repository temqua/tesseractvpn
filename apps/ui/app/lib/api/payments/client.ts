import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { ICreatePaymentDto, IPayment, IUpdatePaymentDto } from './definitions';

export class PaymentsClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IPayment>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/admin/payments?${params}`);
	}

	async getById(id: string): Promise<IPayment> {
		return await apiClient.get(`/api/v1/admin/payments/${id}`);
	}

	async create(dto: ICreatePaymentDto) {
		return await apiClient.post(`/api/v1/admin/payments`, {
			body: JSON.stringify(dto),
		});
	}

	async update(id: string, dto: IUpdatePaymentDto) {
		return await apiClient.patch(`/api/v1/admin/payments/${id}`, {
			body: JSON.stringify(dto),
		});
	}

	async delete(id: string) {
		return await apiClient.delete(`/api/v1/admin/payments/${id}`);
	}

	async getForUser(listParams: IListParams) {
		const params = new URLSearchParams(listParams as Record<string, string>);

		return await apiClient.get(`/api/v1/payments?${params}`);
	}
}
export const paymentsClient = new PaymentsClient();
