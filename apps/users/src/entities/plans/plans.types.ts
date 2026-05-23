import { CmdCode, PlanCommand, UpdatePlanPropsMap } from '../../enums';

export interface PlansContext {
	[CmdCode.Command]: PlanCommand;
	id?: string;
	propId?: UpdatePlanPropsMap;
	prop?: string;
	setNull?: boolean;
}

export interface CreatePlanDto {
	name: string;

	amount: number;

	price: number;

	minCount: number;

	maxCount: number;

	monthsCount: number;
}

export type Plan = {
	name: string;
	id: number;
	createdAt: string;
	price: number;
	currency: string;
	amount: number;
	months: number;
	minCount: number;
	maxCount: number;
	legacy: boolean | null;
};
