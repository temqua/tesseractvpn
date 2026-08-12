import { IListParams, ListResponse } from '../../definitions.global';
import apiClient from '../api-client';
import { IPlan } from './definitions';

export class PlansClient {
	async getAll(listParams?: IListParams): Promise<ListResponse<IPlan>> {
		const params = new URLSearchParams(listParams as Record<string, string>);
		return await apiClient.get(`/api/v1/plans?${params}`);
	}

	async getById(id: string): Promise<IPlan> {
		return await apiClient.get(`/api/v1/plans/${id}`);
	}

	async delete(id: string) {
		return await apiClient.delete(`/api/v1/plans/${id}`);
	}
}

export const plansClient = new PlansClient();
