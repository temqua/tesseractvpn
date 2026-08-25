import { IServer } from '../servers/definitions';
import { IVPNUser } from '../users/definitions';

export interface IUserServer {
	id: number;
	userId: number;
	serverId: number;
	protocol: string;
	username: string;
	assignedAt: string;
	server: IServer;
	user: IVPNUser;
	downloadLink: string;
}

export interface IUserServerUI {
	id: number;
	userId: number;
	protocol: string;
	username: string;
	assignedAt: string;
	downloadLink: string;
}
