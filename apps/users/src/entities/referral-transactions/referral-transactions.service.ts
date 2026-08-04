import { Message } from 'node-telegram-bot-api';
import { basename } from 'path';
import logger from '../../logger';
import { globalHandler } from '../../global.handler';
import bot from '../../bot';
import { ReferralTransactionsClient } from './referral-transactions.client';
import { ReferralTransaction } from './referral-transactions.types';
import { formatDate } from '../../utils';

export class ReferralTransactionsService {
	constructor(private client = new ReferralTransactionsClient()) {}
	async getById(message: Message, start: boolean) {
		this.log('getById');
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter referral transaction id');
			return;
		}
		const found = await this.client.getById(message?.text ?? '');
		if (found) {
			await bot.sendMessage(
				message.chat.id,
				'В системе найдена следующая реферальная транзакция по введённому ID:',
			);

			await this.showInfo(message, found);
		} else {
			await bot.sendMessage(message.chat.id, 'В системе не найдено реферальных транзакций с введённым ID');
		}
		globalHandler.finishCommand();
	}

	async showAll(msg: Message) {
		this.log('showAll');
		const rts = await this.client.getAll();
		for (const rt of rts) {
			await this.showInfo(msg, rt);
		}
		if (!rts.length) {
			await bot.sendMessage(msg.chat.id, 'В системе нет реферальных транзакций');
		}
		globalHandler.finishCommand();
	}

	async delete(message: Message, start: boolean) {
		this.log(`delete`);
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter rt id');
			return;
		}
		await this.deleteReferralTransaction(message, message.text);
	}

	private async deleteReferralTransaction(message: Message, id: string) {
		try {
			const result = await this.client.delete(id);
			await bot.sendMessage(
				message.chat.id,
				`Выбранная реф транзакция \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\` датой ${formatDate(result.createdAt).replace(/[-.*#_]/g, match => `\\${match}`)} успешно удалена из системы`,
				{
					parse_mode: 'MarkdownV2',
				},
			);
		} catch (err) {
			await bot.sendMessage(message.chat.id, `Ошибка удаления реф транзакции: ${err}`);
			logger.error(`Ошибка удаления реф транзакции: ${err}`);
		} finally {
			globalHandler.finishCommand();
		}
	}

	private async showInfo(msg: Message, rt: ReferralTransaction) {
		const message = `
UUID: \`${rt.id.replace(/[-.*#_]/g, match => `\\${match}`)}\`
Referrer: ${rt.referrer.username.replace(/[-.*#_]/g, match => `\\${match}`)} id ${rt.referrerId}
Referred: ${rt.referred.username.replace(/[-.*#_]/g, match => `\\${match}`)} id ${rt.referredId}
Payment: \`${rt.paymentId.replace(/[-.*#_]/g, match => `\\${match}`)}\`
Create at: ${formatDate(rt.createdAt).replace(/[-.*#_]/g, match => `\\${match}`)} 
`;

		await bot.sendMessage(msg.chat.id, message, {
			parse_mode: 'MarkdownV2',
		});
	}

	private log(message: string) {
		logger.log(`[${basename(__filename)}]: ${message}`);
	}
}
