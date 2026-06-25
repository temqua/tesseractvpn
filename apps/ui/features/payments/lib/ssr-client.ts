import { IPayment } from '@/app/lib/api/payments/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class PaymentsSSRClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IPayment>> {
		const params = new URLSearchParams(listParams as Record<string, string>);

		return await ssrClient.get(`/api/v1/payments?${params}`);
	}

	async getById(id: string): Promise<IPayment> {
		return await ssrClient.get(`/api/v1/payments/${id}`);
	}
}
export const paymentsSSRClient = new PaymentsSSRClient();
