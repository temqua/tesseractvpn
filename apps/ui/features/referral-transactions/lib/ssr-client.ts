import { IReferralTransaction } from '@/app/lib/api/referral-transactions/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class ReferralTransactionsSSRClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IReferralTransaction>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/referral-transactions?${params}`);
	}

	async getById(id: string): Promise<IReferralTransaction> {
		return await ssrClient.get(`/api/v1/referral-transactions/${id}`);
	}
}
export const referralTransactionsSSRClient = new ReferralTransactionsSSRClient();
