import TelegramBot, { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { isAdmin } from '../utils';
import { CmdCode, CommandScope, ReferralTransactionCommand } from '../enums';
import { globalHandler } from '../global.handler';
import { rtButtons } from '../entities/referral-transactions/referral-transactions.buttons';

export const rtCommandsList = {
	menu: {
		regexp: /\/rt$/,
		docs: '/rt — show referral transactions menu',
	},
	all: {
		regexp: /\/rts$/,
		docs: '/rts — show referral transactions list',
	},
	getById: {
		regexp: /\/rt\s+get/,
		docs: '/rt get — show referral transaction by id',
	},
	delete: {
		regexp: /\/rt\s+delete/,
		docs: '/rt delete — delete referral transaction',
	},
};

export const rtHelpMessage = Object.values(rtCommandsList)
	.map(c => c.docs)
	.join('\n');

bot.onText(rtCommandsList.menu.regexp, async (msg: Message) => {
	if (!isAdmin(msg)) {
		return;
	}
	const inlineKeyboard = {
		reply_markup: {
			inline_keyboard: rtButtons,
		},
	};
	await bot.sendMessage(msg.chat.id, 'Select operation', inlineKeyboard);
});

bot.onText(rtCommandsList.all.regexp, async (msg: Message) => {
	if (isAdmin(msg)) {
		globalHandler.execute(
			{
				scope: CommandScope.ReferralTransactions,
				context: {
					[CmdCode.Command]: ReferralTransactionCommand.List,
				},
			},
			{
				message: msg,
			} as TelegramBot.CallbackQuery,
		);
		return;
	}
});

bot.onText(rtCommandsList.delete.regexp, async (msg: Message) => {
	if (!isAdmin(msg)) {
		return;
	}
	globalHandler.execute(
		{
			scope: CommandScope.ReferralTransactions,
			context: {
				[CmdCode.Command]: ReferralTransactionCommand.Delete,
			},
		},
		{
			message: msg,
		} as TelegramBot.CallbackQuery,
	);
});

bot.onText(rtCommandsList.getById.regexp, async (msg: Message) => {
	if (!isAdmin(msg)) {
		return;
	}
	globalHandler.execute(
		{
			scope: CommandScope.ReferralTransactions,
			context: {
				[CmdCode.Command]: ReferralTransactionCommand.GetById,
			},
		},
		{
			message: msg,
		} as TelegramBot.CallbackQuery,
	);
});
