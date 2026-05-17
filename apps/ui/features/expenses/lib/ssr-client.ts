import ssrClient from '@/app/lib/api/ssr-client';
import { IExpense } from '@/app/lib/api/expenses/definitions';

export class ExpensesSSRClient {
	async getAll(): Promise<IExpense[]> {
		return await ssrClient.get('/api/v1/expenses');
	}

	async getById(id: string): Promise<IExpense> {
		return await ssrClient.get(`/api/v1/expenses/${id}`);
	}
}
export const expensesSSRClient = new ExpensesSSRClient();
