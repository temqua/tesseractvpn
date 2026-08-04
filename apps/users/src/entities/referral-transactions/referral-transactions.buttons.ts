import { InlineKeyboardButton } from 'node-telegram-bot-api';
import { CmdCode, CommandScope, ReferralTransactionCommand } from '../../enums';

export const rtButtons: InlineKeyboardButton[][] = [
	[
		{
			text: 'Find by ID',
			callback_data: JSON.stringify({
				[CmdCode.Scope]: CommandScope.ReferralTransactions,
				[CmdCode.Context]: {
					[CmdCode.Command]: ReferralTransactionCommand.GetById,
				},
			}),
		},
	],
	[
		{
			text: 'Show All',
			callback_data: JSON.stringify({
				[CmdCode.Scope]: CommandScope.ReferralTransactions,
				[CmdCode.Context]: {
					[CmdCode.Command]: ReferralTransactionCommand.List,
				},
			}),
		},
		{
			text: 'Delete',
			callback_data: JSON.stringify({
				[CmdCode.Scope]: CommandScope.ReferralTransactions,
				[CmdCode.Context]: {
					[CmdCode.Command]: ReferralTransactionCommand.Delete,
				},
			}),
		},
	],
];
