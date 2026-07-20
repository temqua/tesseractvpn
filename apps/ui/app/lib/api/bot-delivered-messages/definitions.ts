import { IVPNUser } from '../users/definitions';

export interface IBotDeliveredMessageDTO {
	id: string;
	message: string;
	userId: number;
	user: IVPNUser;
	createdAt: string;
}

export interface IBotDeliveredMessage {
	id: string;
	message: string;
	userId: number;
	createdAt: string;
}

export interface IBotDeliveredMessageUI {
	id: string;
	message: string;
	userId: number;
	createdAt: string;
	username: string;
}
