'use client';
import { toast } from '@/app/components/toast';
import apiClient from '../api-client';
import { ICreateExpenseDTO, IExpense, IUpdateExpenseDto } from './definitions';

export class ExpensesClient {
	async getAll(): Promise<IExpense[]> {
		return await apiClient.get('/api/v1/expenses');
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
		const response = await apiClient.patch(`/api/v1/expenses/${id}`, {
			body: JSON.stringify(dto),
		});
		if (response.ok) {
			toast.success(`Expense ${id} has been successfully updated`);
		}
		return await response.json();
	}

	async delete(id: string) {
		return await apiClient.delete(`/api/v1/expenses/${id}`);
	}
}
export const expensesClient = new ExpensesClient();
