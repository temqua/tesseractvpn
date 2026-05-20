import { IPayment } from '@/app/lib/api/payments/definitions';
import ssrClient from '@/app/lib/api/ssr-client';

export class PaymentsSSRClient {
	async getAll(): Promise<IPayment[]> {
		return await ssrClient.get('/api/v1/payments');
	}

	async getById(id: string): Promise<IPayment> {
		return await ssrClient.get(`/api/v1/payments/${id}`);
	}
}
export const paymentsSSRClient = new PaymentsSSRClient();
