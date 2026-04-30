import apiClient from '../api-client';

export class PaymentsClient {
	async getAll() {
		return await apiClient.get('/api/v1/payments');
	}
}
export const paymentsClient = new PaymentsClient();
