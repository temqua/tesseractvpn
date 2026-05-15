import ssrClient from '../ssr-client';
import { IExpense } from './definitions';

export class ExpensesSSRClient {
	async getAll(): Promise<IExpense[]> {
		return await ssrClient.get('/api/v1/expenses');
	}

	async getById(id: string): Promise<IExpense> {
		return await ssrClient.get(`/api/v1/expenses/${id}`);
	}
}
export const expensesClient = new ExpensesSSRClient();
