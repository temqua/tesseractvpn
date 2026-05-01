import apiClient from '../api-client';
import { IExpense } from './definitions';

export class ExpensesClient {
	async getAll(): Promise<IExpense[]> {
		return await apiClient.get('/api/v1/expenses');
	}

	async getById(id: string): Promise<IExpense> {
		return await apiClient.get(`/api/v1/expenses/${id}`);
	}
}
export const expensesClient = new ExpensesClient();
