export interface IExpense {
	id: string;
	paymentDate: string;
	amount: number;
	currency: string;
	category: ExpenseCategory;
	description: string | null;
}

export type ExpenseCategory = 'Nalog' | 'Servers';
