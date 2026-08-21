import { TGAuthParams } from './api/auth';

export interface IErrorBody {
	message?: string;
	statusCode?: string;
}

export interface IListParams {
	take?: number;
	skip?: number;
}

export interface ListResponse<T> {
	data: T[];
	count: number;
}

declare global {
	interface Window {
		onTelegramAuth: (user: TGAuthParams & { error: string }) => void;
	}
}
