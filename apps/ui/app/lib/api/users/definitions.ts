import { IBotDeliveredMessage } from '../bot-delivered-messages/definitions';
import { IPayment } from '../payments/definitions';

export interface IVPNUserListDTO {
	id: number;
	username: string;
	password: string | null;
	telegramId: string | null;
	telegramLink: string | null;
	createdAt: string;
	firstName: string | null;
	lastName: string | null;
	languageCode: string | null;
	price: number;
	free: boolean;
	active: boolean;
	bank: string | null;
	currency: string;
	subLink: string | null;
	pasarguardUsername: string | null;
	pasarguardId: number | null;
	rwLink: string | null;
	rwUsername: string | null;
	rwId: number | null;
	rwUUID: string | null;
	payerId: number | null;
	referrerId: number | null;
	muted: boolean | null;
	payments: IPayment[];
	dependants: IVPNUserListDTO[];
	// messageDeliveries: IBotDeliveredMessage[];
	// role: $Enums.UserRole;
	// devices: $Enums.Device[];
}

export interface IVPNUserDTO extends IVPNUserListDTO {
	messageDeliveries: IBotDeliveredMessage[];
}

export interface IVPNUser {
	id: number;
	username: string;
	password: string | null;
	telegramId: string | null;
	telegramLink: string | null;
	createdAt: string;
	firstName: string | null;
	lastName: string | null;
	languageCode: string | null;
	price: number;
	free: boolean;
	active: boolean;
	bank: string | null;
	currency: string;
	subLink: string | null;
	pasarguardUsername: string | null;
	pasarguardId: number | null;
	rwLink: string | null;
	rwUsername: string | null;
	rwId: number | null;
	rwUUID: string | null;
	payerId: number | null;
	referrerId: number | null;
	muted: boolean | null;
}

export interface IVPNUserUI {
	id: number;
	username: string;
	password: string | null;
	telegramId: string | null;
	telegramLink: string | null;
	createdAt: string;
	firstName: string | null;
	lastName: string | null;
	languageCode: string | null;
	price: number;
	free: boolean;
	active: boolean;
}
