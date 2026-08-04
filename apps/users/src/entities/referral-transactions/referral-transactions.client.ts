import client from '../../api-client';
import { ListResponse } from '../../definitions';
import { CreateReferralTransactionDto, ReferralTransaction } from './referral-transactions.types';

export class ReferralTransactionsClient {
	async getAll(): Promise<ReferralTransaction[]> {
		const { data } = (await client.get(`/referral-transactions`)) as ListResponse<ReferralTransaction>;
		return data as ReferralTransaction[];
	}

	async getById(id: string): Promise<ReferralTransaction | null> {
		const result = await client.get(`/referral-transactions/${id}`);
		return result as ReferralTransaction;
	}

	async create(dto: CreateReferralTransactionDto): Promise<ReferralTransaction | null> {
		const result = await client.post(`/referral-transactions`, {
			body: JSON.stringify(dto),
		});
		return result as ReferralTransaction | null;
	}

	async delete(id: string): Promise<ReferralTransaction> {
		const result = await client.delete(`/referral-transactions/${id}`);
		return result as ReferralTransaction;
	}
}
