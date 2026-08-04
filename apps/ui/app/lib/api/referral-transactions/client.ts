import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IReferralTransaction } from './definitions';

export class ReferralTransactionsClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IReferralTransaction>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/referral-transactions?${params}`);
	}
	async delete(id: string) {
		return await apiClient.delete(`/api/v1/referral-transactions/${id}`);
	}
}
export const referralTransactionsClient = new ReferralTransactionsClient();
