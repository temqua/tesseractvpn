import type { CallbackQuery, Message, User } from 'node-telegram-bot-api';
import type { ICommandHandler } from '../../contracts';
import { CmdCode, PaymentCommand, ReferralTransactionCommand } from '../../enums';
import { ReferralTransactionsService } from './referral-transactions.service';
import { ReferralTransactionsContext } from './referral-transactions.types';

class ReferralTransactionsCommandsHandler implements ICommandHandler {
	constructor(private service: ReferralTransactionsService = new ReferralTransactionsService()) {}

	async handle(context: ReferralTransactionsContext, message: Message, from: User, start = false) {
		if (context[CmdCode.Command] === ReferralTransactionCommand.List) {
			await this.service.showAll(message);
		}
		if (context[CmdCode.Command] === ReferralTransactionCommand.Delete) {
			await this.service.delete(message, start);
		}
		if (context[CmdCode.Command] === ReferralTransactionCommand.GetById) {
			await this.service.getById(message, start);
		}
	}

	async handleQuery(context: ReferralTransactionsContext, query: CallbackQuery, start = false) {
		this.handle(context, query.message, query.from, start);
	}
}

export const referralTransactionsCommandsHandler = new ReferralTransactionsCommandsHandler();
