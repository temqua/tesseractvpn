import client from '../../api-client';
import logger from '../../logger';

export class CreateBotIncomingMessageDto {
	telegramId: string;

	firstName: string;

	lastName?: string;

	username?: string;

	isBot?: boolean;
}

export class BotIncomingMessagesClient {
	async create(dto: CreateBotIncomingMessageDto) {
		return client
			.post(`/bot-incoming-messages`, {
				body: JSON.stringify({
					...dto,
				}),
			})
			.catch(err => {
				logger.error(err);
			});
	}
}
