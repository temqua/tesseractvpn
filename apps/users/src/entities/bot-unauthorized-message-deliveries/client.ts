import client from '../../api-client';
import logger from '../../logger';

export class CreateBotUnauthorizedDeliveredMessageDto {
	message: string;
	telegramId?: string;
}

export class BotUnauthorizedMessageDeliveriesClient {
	async create(dto: CreateBotUnauthorizedDeliveredMessageDto) {
		return client
			.post(`/bot-unauthorized-delivered-messages`, {
				body: JSON.stringify({
					...dto,
				}),
			})
			.catch(err => {
				logger.error(err);
			});
	}
}
