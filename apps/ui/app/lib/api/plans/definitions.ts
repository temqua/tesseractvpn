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

export interface ICreatePlanDto {
	amount: number;
	name: string;
	monthsCount: number;
	price: number;
	minCount: number;
	maxCount: number;
}

export interface IUpdatePlanDto extends Partial<ICreatePlanDto> {}
