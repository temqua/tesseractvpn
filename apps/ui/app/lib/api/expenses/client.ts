import apiClient from '../api-client';
import { IExpense } from './definitions';

export class ExpensesClient {
	async getAll(): Promise<IExpense[]> {
		return await apiClient.get('/api/v1/expenses');
	}

	async getById(id: string): Promise<IExpense> {
		return await apiClient.get(`/api/v1/expenses/${id}`);
	}

	async create(dto) {
		return await apiClient.post(`/api/v1/expenses`, {
			body: JSON.stringify(dto),
		});
	}

	async update(id: string, dto) {
		return await apiClient.patch(`/api/v1/expenses/${id}`, {
			body: JSON.stringify(dto),
		});
	}

	async delete(id: string) {
		return await apiClient.delete(`/api/v1/expenses/${id}`);
	}
}
export const expensesClient = new ExpensesClient();
