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
