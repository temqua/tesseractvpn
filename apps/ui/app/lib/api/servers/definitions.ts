export interface IServer {
	id: number;
	name: string;
	url: string;
	createdAt: string;
}

export interface ICreateServerDto {
	name: string;
	url: string;
}

export interface IUpdateServerDto extends Partial<ICreateServerDto> {}
