import client from '../../api-client';
import logger from '../../logger';

export class CreateBotUnauthorizedUserActionDto {
	telegramId: string;

	firstName: string;

	lastName?: string;

	username?: string;

	isBot?: boolean;

	command?: string;

	action?: string;
}

export class BotUnauthorizedUserActionsClient {
	async create(dto: CreateBotUnauthorizedUserActionDto) {
		return client
			.post(`/bot-unauthorized-user-actions`, {
				body: JSON.stringify({
					...dto,
				}),
			})
			.catch(err => {
				logger.error(err);
			});
	}
}
