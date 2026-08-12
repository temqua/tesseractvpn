export interface IPlan {
	id: number;
	name: string;
	amount: number;
	months: number;
	price: number;
	currency: string;
	minCount: number;
	maxCount: number;
	createdAt: string;
	legacy: boolean;
}
