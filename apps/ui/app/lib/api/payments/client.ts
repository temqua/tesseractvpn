import apiClient from '../api-client';
import { IPayment } from './definitions';

export class PaymentsClient {
	async getAll(): Promise<IPayment[]> {
		return await apiClient.get('/api/v1/payments');
	}
}
export const paymentsClient = new PaymentsClient();
