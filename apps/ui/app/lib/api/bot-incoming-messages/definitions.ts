export interface IBotIncomingMessage {
	id: string;
	text: string;
	telegramId: string;
	firstName: string;
	lastName: string;
	username: string;
	languageCode: string;
	isBot: boolean;
	createdAt: string;
}
