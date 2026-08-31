import { IPlan } from '@/app/lib/api/plans/definitions';
import ssrClient from '@/app/lib/api/ssr-client';
import { IListParams, ListResponse } from '@/app/lib/definitions.global';

export class PlansSSRClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IPlan>> {
		const params = new URLSearchParams(listParams as Record<string, string>);

		return await ssrClient.get(`/api/v1/plans?${params}`);
	}

	async getById(id: string): Promise<IPlan> {
		return await ssrClient.get(`/api/v1/plans/${id}`);
	}
}
export const plansSSRClient = new PlansSSRClient();
