export interface IExpense {
	id: string;
	paymentDate: string;
	amount: number;
	currency: string;
	category: ExpenseCategory;
	description: string | null;
}

export type ExpenseCategory = 'Nalog' | 'Servers';

export interface ICreateExpenseDTO {
	category: ExpenseCategory;
	amount: number;
	description: string;
}

export type IUpdateExpenseDto = Partial<ICreateExpenseDTO> & {
	paymentDate: string;
};
