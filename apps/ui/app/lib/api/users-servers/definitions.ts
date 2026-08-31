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
	qrLink: string | null;
}

export interface IServerUserUI {
	id: number;
	userId: number;
	protocol: string;
	username: string;
	assignedAt: string;
	downloadLink: string;
	qrLink: string | null;
}

export interface IUserServerUI {
	id: number;
	protocol: string;
	url: string;
	assignedAt: string;
	username: string;
	downloadLink: string;
	qrLink: string | null;
}
