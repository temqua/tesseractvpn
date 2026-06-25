import ssrClient from '@/app/lib/api/ssr-client';
import { IExpense } from '@/app/lib/api/expenses/definitions';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class ExpensesSSRClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IExpense>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await ssrClient.get(`/api/v1/expenses?${params}`);
	}

	async getById(id: string): Promise<IExpense> {
		return await ssrClient.get(`/api/v1/expenses/${id}`);
	}
}
export const expensesSSRClient = new ExpensesSSRClient();
