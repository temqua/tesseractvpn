export interface IErrorBody {
	message?: string;
	statusCode?: string;
}

export interface IListParams {
	take?: number;
	page?: number;
	filterBy?: string;
	filterValue?: string;
	filterOperation?: string;
}
