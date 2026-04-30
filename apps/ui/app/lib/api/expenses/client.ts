import apiClient from '../api-client';

export class ExpensesClient {
	async getAll() {
		return await apiClient.get('/api/v1/expenses');
	}
}
export const expensesClient = new ExpensesClient();
