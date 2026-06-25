'use client';
import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { ICreateExpenseDTO, IExpense, IUpdateExpenseDto } from './definitions';

export class ExpensesClient {
	async getAll(listParams: IListParams): Promise<ListResponse<IExpense>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/expenses?${params}`);
	}

	async getById(id: string): Promise<IExpense> {
		return await apiClient.get(`/api/v1/expenses/${id}`);
	}

	async create(dto: ICreateExpenseDTO) {
		return await apiClient.post(`/api/v1/expenses`, {
			body: JSON.stringify(dto),
		});
	}

	async update(id: string, dto: IUpdateExpenseDto) {
		return await apiClient.patch(`/api/v1/expenses/${id}`, {
			body: JSON.stringify(dto),
		});
	}

	async delete(id: string) {
		return await apiClient.delete(`/api/v1/expenses/${id}`);
	}
}
export const expensesClient = new ExpensesClient();
