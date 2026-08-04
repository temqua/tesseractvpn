import { addDays, addMonths, parse } from 'date-fns';
import type { Message, User as TGUser } from 'node-telegram-bot-api';
import { basename } from 'path';
import bot from '../../bot';
import { getFrequestPaymentAmountsKeyboard, getReferredKeyboard, getYesNoKeyboard } from '../../buttons';
import { dict } from '../../dict';
import { CmdCode, CommandScope, PaymentCommand, UserRequest, VPNUserCommand } from '../../enums';
import env from '../../env';
import { globalHandler } from '../../global.handler';
import logger from '../../logger';
import { formatDate, setActiveStep, uuid32to36 } from '../../utils';
import { PlansClient } from '../plans/plans.client';
import { Plan } from '../plans/plans.types';
import { ReferralTransactionsClient } from '../referral-transactions/referral-transactions.client';
import { NalogService } from '../users/nalog.service';
import { PasarguardService } from '../users/pasarguard.service';
import { RemnawaveService } from '../users/rw.service';
import { acceptKeyboard, getExpirationDateKeyboard, getUserKeyboard } from '../users/users.buttons';
import { UsersClient } from '../users/users.client';
import { UsersContext, VPNUser } from '../users/users.types';
import { PaymentsClient } from './payments.client';
import { Payment, PaymentsContext } from './payments.types';
type AvailableFields =
	| 'amount'
	| 'from'
	| 'to'
	| 'user'
	| 'nalog'
	| 'expires'
	| 'months'
	| 'dependants'
	| 'plan'
	| 'referrer'
	| 'referred';
export class PaymentsService {
	constructor(
		private pasarguardService: PasarguardService = new PasarguardService(),
		private client: PaymentsClient = new PaymentsClient(),
		private usersClient: UsersClient = new UsersClient(),
		private plansClient: PlansClient = new PlansClient(),
		private rwService = new RemnawaveService(),
		private rtClient = new ReferralTransactionsClient(),
	) {}

	private nalogService: NalogService = new NalogService();
	private params = new Map<AvailableFields, unknown>();
	private paymentSteps = {
		user: false,
		amount: false,
		months: false,
		expires: false,
		nalog: false,
		dependants: false,
	};
	private referralPaymentSteps = {
		referrer: false,
		referred: false,
		nalog: false,
		dependants: false,
		expires: false,
	};
	private findByDateRangeSteps = {
		from: false,
		to: false,
	};

	async showPayments(message: Message, context: UsersContext, from?: TGUser) {
		const lang = from?.is_bot ? 'ru' : from?.language_code;
		let userId: string = context.id;
		if (!context.id) {
			const user = await this.usersClient.getByTelegramId(message.chat.id.toString());
			userId = user.id.toString();
		}
		const payments = await this.client.getAllByUserId(Number(userId));
		if (!payments.length) {
			await bot.sendMessage(message.chat.id, dict.payments_not_found[lang]);
		}
		for (const p of payments) {
			await this.showPaymentInfo(message, p);
		}
		globalHandler.finishCommand();
	}

	async showReferralPayments(message: Message, context: UsersContext, from?: TGUser) {
		const lang = from?.is_bot ? 'ru' : from?.language_code;
		let userId: string = context.id;
		const user = context.id
			? await this.usersClient.getById(userId)
			: await this.usersClient.getByTelegramId(message.chat.id.toString());
		if (!context.id) {
			userId = user.id.toString();
		}
		const rts = user?.referrerTransactions;
		if (!rts?.length) {
			await bot.sendMessage(message.chat.id, dict.referral_payments_not_found[lang]);
		}
		for (const p of rts) {
			await this.showPaymentInfo(message, p.payment);
		}
		globalHandler.finishCommand();
	}

	async showLastPayment(message: Message, context: UsersContext, from?: TGUser) {
		const lang = from?.is_bot ? 'ru' : from?.language_code;
		let userId: string = context.id;
		if (!context.id) {
			const user = await this.usersClient.getByTelegramId(message.chat.id.toString());
			userId = user.id.toString();
		}
		this.usersClient.createAction(userId, 'ShowLastPayment', `${dict.last_payment[lang]}`);
		const payment = await this.usersClient.getLastPayment(Number(userId));
		if (payment) {
			try {
				const p = this.formatUserPayment(payment);
				await bot.editMessageText(p, {
					parse_mode: 'MarkdownV2',
					message_id: message.message_id,
					chat_id: message.chat.id,
					reply_markup: getUserKeyboard(lang),
				});
				this.usersClient.captureDelivery(userId, p);
			} catch (err) {
				logger.error(err);
			}
		} else {
			await bot.editMessageText(dict.payments_not_found[lang], {
				message_id: message.message_id,
				chat_id: message.chat.id,
				reply_markup: getUserKeyboard(lang),
			});
			this.usersClient.captureDelivery(userId, dict.payments_not_found[lang]);
		}
		globalHandler.finishCommand();
	}

	async showLastPaymentAdmin(message: Message, context: UsersContext, from?: TGUser) {
		const lang = from?.is_bot ? 'ru' : from?.language_code;
		const payment = await this.usersClient.getLastPayment(Number(context.id));
		if (payment) {
			try {
				bot.sendMessage(message.chat.id, this.formatUserPayment(payment), {
					parse_mode: 'MarkdownV2',
				});
			} catch (err) {
				logger.error(err);
			}
		} else {
			await bot.sendMessage(message.chat.id, dict.payments_not_found[lang]);
		}
		globalHandler.finishCommand();
	}

	async sum(chatId: number) {
		const result = await this.client.sum();
		const amount = result.amount;
		await bot.sendMessage(chatId, `Сумма всех платежей в системе: ${amount}`);
		globalHandler.finishCommand();
	}

	async deleteExecuted(message: Message, context: PaymentsContext) {
		this.log(`deleteExecuted`);
		await this.deletePayment(message, uuid32to36(context.id));
	}

	async delete(message: Message, start: boolean) {
		this.log(`delete`);
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter payment id');
			return;
		}
		await this.deletePayment(message, message.text);
	}

	async getById(message: Message, start: boolean) {
		this.log('getById');
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter payment id');
			return;
		}
		const found = await this.client.getById(message?.text ?? '');
		if (found) {
			await bot.sendMessage(message.chat.id, 'В системе найден следующий платёж по введённому ID:');
			await this.showPaymentInfo(message, found);
		} else {
			await bot.sendMessage(message.chat.id, 'В системе не найдено платежей с введённым ID');
		}
		globalHandler.finishCommand();
	}

	async findByDate(message: Message, start: boolean) {
		this.log('findByDate');
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter date in ISO Format (2025-08-03)');
			return;
		}
		if (!message.text) {
			await bot.sendMessage(message.chat.id, `message.text is null/empty ${message?.text}`);
			globalHandler.finishCommand();
			return;
		}
		try {
			const found = await this.client.getAllByDateRange(message.text, message.text);
			if (found.length) {
				await bot.sendMessage(message.chat.id, 'В системе найдены следующие платёжи по указанной дате');
				for (const p of found) {
					await this.showPaymentInfo(message, p);
				}
			} else {
				await bot.sendMessage(message.chat.id, 'В системе не найдено платежей в указанную дату');
			}
		} catch (error) {
			await bot.sendMessage(message.chat.id, `Ошибка поиска платежа по дате: ${error}`);
			logger.error(`Ошибка поиска платежа по дате: ${error}`);
		} finally {
			globalHandler.finishCommand();
		}
	}

	async findByDateRange(message: Message, start: boolean) {
		this.log('findByDateRange');
		if (start) {
			await bot.sendMessage(message.chat.id, 'Enter date from in ISO Format (2025-08-03)');
			this.findByDateRangeSteps.from = true;
			return;
		}
		if (this.findByDateRangeSteps.from) {
			this.params.set('from', message.text);
			this.findByDateRangeSteps.to = true;
			this.findByDateRangeSteps.from = false;
			await bot.sendMessage(message.chat.id, 'Enter date to in ISO Format (2025-08-03)');
			return;
		}
		if (!message.text) {
			await bot.sendMessage(message.chat.id, `message.text is null/empty ${message?.text}`);
			this.params.clear();
			globalHandler.finishCommand();
			return;
		}
		try {
			const fromStr = this.params.get('from') as string;
			// let from = parse(fromStr, 'yyyy-MM-dd', new Date());
			// let to = parse(message.text, 'yyyy-MM-dd', new Date());
			// if (from > to) {
			// 	const temp = from;
			// 	from = to;
			// 	to = temp;
			// }
			const found = await this.client.getAllByDateRange(fromStr, message.text);
			if (found.length) {
				await bot.sendMessage(message.chat.id, 'В системе найдены следующие платёжи в указанные даты');
				for (const p of found) {
					await this.showPaymentInfo(message, p);
				}
			} else {
				await bot.sendMessage(message.chat.id, 'В системе не найдено платежей в указанные даты');
			}
		} catch (error) {
			await bot.sendMessage(message.chat.id, `Ошибка поиска платежей по датам: ${error}`);
			logger.error(`Ошибка поиска платежей по датам: ${error}`);
		} finally {
			globalHandler.finishCommand();
		}
	}

	async approvePayment(message: Message, context: UsersContext, start: boolean) {
		await this.pay(message, context, start);
	}

	async pay(message: Message | null, context: UsersContext, start: boolean) {
		this.log(`pay. Active step "${this.getActiveStep(this.paymentSteps) ?? 'start'}"`);
		const chatId = message?.chat?.id ?? env.ADMIN_USER_ID;

		if (start) {
			setActiveStep('user', this.paymentSteps);
			if (!context.id) {
				await bot.sendMessage(chatId, 'Share user or enter username', {
					reply_markup: {
						keyboard: [
							[
								{
									text: 'Share contact',
									request_user: {
										request_id: UserRequest.Pay,
									},
								},
							],
						],
						one_time_keyboard: true, // The keyboard will hide after one use
						resize_keyboard: true, // Fit the keyboard to the screen size
					},
				});
				return;
			}
		}
		if (this.paymentSteps.user) {
			let user: VPNUser | null;
			if (context.id) {
				user = await this.usersClient.getById(Number(context.id));
			} else if (message?.user_shared?.user_id) {
				user = await this.usersClient.getByTelegramId(message.user_shared.user_id.toString());
			} else {
				user = await this.usersClient.getByUsername(message?.text ?? '');
			}

			if (!user) {
				const errorMessage = 'Пользователь не найден в системе';
				logger.error(errorMessage);
				await bot.sendMessage(chatId, errorMessage);
				this.params.clear();
				globalHandler.finishCommand();
				return;
			}
			this.params.set('user', user);
			const prices = [user.price];
			if (user.payments?.length) {
				const lastPayment = user.payments[0];
				if (lastPayment.amount !== user.price) {
					prices.push(lastPayment.amount);
				}
			}
			await bot.sendMessage(
				chatId,
				`Платёжная операция для пользователя ${user.username}. Введите количество денег в рублях, либо выберите из списка`,
				getFrequestPaymentAmountsKeyboard(prices),
			);
			setActiveStep('amount', this.paymentSteps);
			return;
		}

		const user = this.params.get('user') as VPNUser;
		if (!user) {
			const errorMessage = `Ошибка при обработке платежа. Пользователь не найден в системе`;
			logger.error(`[${basename(__filename)}]: ${errorMessage}`);
			await bot.sendMessage(chatId, errorMessage);
			this.params.clear();
			globalHandler.finishCommand();
			return;
		}
		if (this.paymentSteps.amount) {
			let amount = 0;
			if (context.a) {
				amount = Number(context.a);
			} else if (message?.text) {
				amount = Number(message.text);
			} else {
				bot.sendMessage(chatId, `message.text is null/empty ${message?.text}`);
				this.params.clear();
				globalHandler.finishCommand();
			}
			this.params.set('amount', amount);
			await this.calculateMonthsCount(chatId, user);
			return;
		}
		if (this.paymentSteps.months) {
			if (!context.accept) {
				if (message?.text) {
					this.params.set('months', Number(message.text));
				} else {
					await bot.sendMessage(chatId, `message.text is null/empty ${message?.text}`);
					this.params.clear();
					globalHandler.finishCommand();
					return;
				}
			}
			delete context.accept;
			const calculated = await this.calculateExpirationDate(
				chatId,
				user,
				this.params.get('months') as number,
				VPNUserCommand.Pay,
			);
			this.params.set('expires', calculated);
			this.setPaymentStep('expires');
			return;
		}
		if (this.paymentSteps.expires) {
			if (!context.accept) {
				if (context.today) {
					this.params.set('expires', addMonths(new Date(), this.params.get('months')));
				} else if (message?.text) {
					this.params.set('expires', new Date(message.text));
				} else {
					await bot.sendMessage(chatId, `message.text is null/empty ${message?.text}`);
					this.params.clear();
					globalHandler.finishCommand();
					return;
				}
			}
			delete context.accept;
			delete context.today;
			await bot.sendMessage(chatId, `Добавить налог?`, {
				reply_markup: {
					inline_keyboard: getYesNoKeyboard(),
				},
			});
			this.params.set('nalog', false);
			this.setPaymentStep('nalog');
			return;
		}
		if (this.paymentSteps.nalog) {
			this.params.set('nalog', Boolean(context?.accept));
			if (user.dependants?.filter(u => u.active)?.length) {
				await bot.sendMessage(chatId, `Добавить платежи для дочерних юзеров?`, {
					reply_markup: {
						inline_keyboard: getYesNoKeyboard(),
					},
				});
				this.params.set('dependants', false);
				this.setPaymentStep('dependants');
				return;
			}
		}
		if (this.paymentSteps.dependants) {
			this.params.set('dependants', Boolean(context?.accept));
		}
		await this.executePayment(chatId, user);
	}

	async payReferral(message: Message, context: UsersContext, start: boolean) {
		this.log(`referral pay. Active step "${this.getActiveStep(this.paymentSteps) ?? 'start'}"`);
		const chatId = message?.chat?.id ?? env.ADMIN_USER_ID;

		if (start) {
			setActiveStep('referrer', this.referralPaymentSteps);
			if (!context.id) {
				await bot.sendMessage(chatId, 'Share user or enter username', {
					reply_markup: {
						keyboard: [
							[
								{
									text: 'Share contact',
									request_user: {
										request_id: UserRequest.PayReferral,
									},
								},
							],
						],
						one_time_keyboard: true, // The keyboard will hide after one use
						resize_keyboard: true, // Fit the keyboard to the screen size
					},
				});
				return;
			}
		}

		if (this.referralPaymentSteps.referrer) {
			let user: VPNUser | null;
			if (context.id) {
				user = await this.usersClient.getById(Number(context.id));
			} else if (message?.user_shared?.user_id) {
				user = await this.usersClient.getByTelegramId(message.user_shared.user_id.toString());
			} else {
				user = await this.usersClient.getByUsername(message?.text ?? '');
			}

			if (!user) {
				const errorMessage = 'Пользователь не найден в системе';
				logger.error(errorMessage);
				await bot.sendMessage(chatId, errorMessage);
				this.params.clear();
				globalHandler.finishCommand();
				return;
			}
			this.params.set('referrer', user);
			if (!user.referred.length) {
				await bot.sendMessage(chatId, 'Нет доступных рефералов для пользователя');
				this.params.clear();
				globalHandler.finishCommand();
				return;
			}
			await bot.sendMessage(
				chatId,
				`Список реферралов для которых доступно списание ${user.username}`,
				getReferredKeyboard(user.referred),
			);
			setActiveStep('referred', this.referralPaymentSteps);
			return;
		}
		const referrer = this.params.get('referrer') as VPNUser;
		if (!referrer) {
			const errorMessage = `Ошибка при обработке реферального платежа. Пользователь не найден в системе`;
			logger.error(`[${basename(__filename)}]: ${errorMessage}`);
			await bot.sendMessage(chatId, errorMessage);
			this.params.clear();
			globalHandler.finishCommand();
			return;
		}
		if (this.referralPaymentSteps.referred) {
			this.params.set('referred', context.rfid);
			const calculated = await this.calculateExpirationDate(chatId, referrer, 1, VPNUserCommand.PayReferral);
			this.params.set('expires', calculated);
			setActiveStep('expires', this.referralPaymentSteps);
			return;
		}
		if (this.referralPaymentSteps.expires) {
			if (!context.accept) {
				if (context.today) {
					this.params.set('expires', addMonths(new Date(), 1));
				} else if (message?.text) {
					this.params.set('expires', new Date(message.text));
				} else {
					await bot.sendMessage(chatId, `message.text is null/empty ${message?.text}`);
					this.params.clear();
					globalHandler.finishCommand();
					return;
				}
			}
			delete context.accept;
			delete context.today;
			delete context.accept;
			if (referrer.dependants?.filter(u => u.active)?.length) {
				await bot.sendMessage(chatId, `Добавить платежи для дочерних юзеров?`, {
					reply_markup: {
						inline_keyboard: getYesNoKeyboard(VPNUserCommand.PayReferral),
					},
				});
				this.params.set('dependants', false);
				setActiveStep('dependants', this.referralPaymentSteps);
				return;
			}
		}
		if (this.referralPaymentSteps.dependants) {
			this.params.set('dependants', Boolean(context?.accept));
		}
		this.executeReferralPayment(chatId, referrer);
	}

	async showAll(msg: Message) {
		this.log('showAll');
		const payments = await this.client.getAll();
		for (const p of payments) {
			await this.showPaymentInfo(msg, p);
		}
		globalHandler.finishCommand();
	}

	private async addPaymentNalog(chatId: number, username: string, amount: number, id: string) {
		this.log('addPaymentNalog');
		try {
			const token = await this.nalogService.auth();
			const paymentId = await this.nalogService.addNalog(token, amount, id);
			if (!paymentId) {
				const errMessage = `Ошибка! При добавлении налога за пользователя ${username} не получен ID операции`;
				logger.error(`[${basename(__filename)}]: ${errMessage}`);
				await bot.sendMessage(chatId, errMessage);
			} else {
				const successMessage = `Налог успешно добавлен за пользователя ${username}`;
				logger.success(`[${basename(__filename)}]: ${successMessage} `);
				await bot.sendMessage(chatId, successMessage);
			}
		} catch (err) {
			const errMessage = `Ошибка при добавлении налога для пользователя ${username}: ${err}`;
			logger.error(`[${basename(__filename)}]: ${errMessage}`);
			await bot.sendMessage(chatId, errMessage);
		}
	}

	private formatUserPayment(p: Payment) {
		return `${p.amount} ${p.currency} оплачено ${formatDate(p.paymentDate).replace(/[-.*#_]/g, match => `\\${match}`)} на срок до ${p.expiresOn ? formatDate(p.expiresOn).replace(/[-.*#_]/g, match => `\\${match}`) : 'unset'}
UUID: \`${p.id}\``;
	}

	private formatPayment(p: Payment) {
		return `UUID: \`${p.id}\`				
Дата оплаты: ${formatDate(p.paymentDate).replace(/[-.*#_]/g, match => `\\${match}`)}
Количество месяцев: ${p.monthsCount}
Оплачено до: ${p.expiresOn ? formatDate(p.expiresOn).replace(/[-.*#_]/g, match => `\\${match}`) : 'unset'}
Сумма: ${p.amount} ${p.currency}
${p.parentPaymentId ? 'Parent payment ID: ' + p.parentPaymentId : ''}`;
	}
	private async calculateMonthsCount(chatId: number, user: VPNUser) {
		const amount = this.params.get('amount') as number;
		const dependants = user.dependants?.filter(d => d.active && !d.free);
		const dependantsCount = dependants?.length ?? 0;
		const plans = await this.plansClient.getAll({
			amount,
			price: user.price,
			count: 1 + dependantsCount,
		});

		if (dependants?.length) {
			await bot.sendMessage(
				chatId,
				`Обнаружено ${dependants.length} зависимых клиентов: ${dependants.map(u => u.username).join(', ')}`,
			);
		}
		if (plans.length) {
			const plan = plans[0];
			await bot.sendMessage(
				chatId,
				`Найден план ${plan.name} для ${plan.amount} ${plan.currency}. 
Цена: ${plan.price} 
Количество человек от ${plan.minCount} до ${plan.maxCount}
Количество месяцев: ${plan.months}
				`,
			);
			this.params.set('plan', plan);
		}
		const monthsCount = plans.length
			? plans[0].months
			: dependantsCount > 0
				? Math.floor(amount / (user.price * (dependantsCount + 1)))
				: Math.floor(amount / user.price);
		await bot.sendMessage(
			chatId,
			`Вычисленное количество месяцев на основании найденного плана, либо по существующей цене ${user.price} для пользователя: ${monthsCount}. Можно ввести своё количество ответным сообщением`,
			acceptKeyboard,
		);
		this.params.set('months', monthsCount);
		this.setPaymentStep('months');
	}

	private async calculateExpirationDate(chatId: number, user: VPNUser, months: number, command: VPNUserCommand) {
		let startPoint = new Date();
		const lastPayment = await this.usersClient.getLastPayment(user.id);
		if (lastPayment) {
			await bot.sendMessage(
				chatId,
				`Последний платёж этого пользователя количеством ${lastPayment.amount} ${lastPayment.currency} 
	создан ${formatDate(lastPayment.paymentDate)} на ${lastPayment.monthsCount} месяцев 
	и истекает ${lastPayment.expiresOn ? formatDate(lastPayment.expiresOn) : 'unset'}`,
			);
			startPoint = new Date(lastPayment.expiresOn);
		}

		// const calculated = addMonths(lastPayment?.expiresOn ?? new Date(), months);
		const calculated = addMonths(startPoint, months);
		console.log('calculated :>> ', calculated);
		await bot.sendMessage(
			chatId,
			`Вычисленная дата окончания работы: ${formatDate(calculated)}`,
			getExpirationDateKeyboard(command),
		);
		return calculated;
	}

	private async executePayment(chatId: number, user: VPNUser) {
		try {
			const amount: number = this.params.get('amount') as number;
			const monthsCount: number = this.params.get('months') as number;
			const expiresOn = this.params.get('expires') as Date;
			const nalog = this.params.get('nalog') as boolean;
			const plan: Plan | null = (this.params.get('plan') as Plan) ?? null;
			const addDependants = this.params.get('dependants') as boolean | undefined;
			const result = await this.client.create({
				userId: user.id,
				amount: Number(amount),
				monthsCount: Number(monthsCount),
				expiresOn: expiresOn.toISOString(),
				planId: plan?.id,
			});
			if (!result) {
				const errMessage = `По непредвиденным обстоятельствам платеж для пользователя ${user.username} c ID ${user.id} не был создан`;
				logger.error(`[${basename(__filename)}]: ${errMessage}`);
				await bot.sendMessage(chatId, errMessage);
				return;
			}
			const successMessage = `Платёж количеством ${amount} рублей на ${monthsCount} месяцев был успешно обработан для пользователя ${user.username}. 
Новая дата истечения срока ${formatDate(expiresOn)}.`;
			logger.success(`[${basename(__filename)}]: ${successMessage}`);
			await bot.sendMessage(chatId, successMessage);
			await bot.sendMessage(chatId, `ID платежа: \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\``, {
				parse_mode: 'MarkdownV2',
			});
			if (user.telegramId) {
				try {
					await bot.sendMessage(user.telegramId, dict.payment_processed['ru']);
				} catch (err) {
					logger.error(`${err}`);
				}
			}
			if (!user.active) {
				this.usersClient
					.update(user.id, {
						active: true,
					})
					.catch(err => {
						bot.sendMessage(env.ADMIN_USER_ID, `Ошибка при активации юзера ${user.username} ${err}`);
					});
			}

			if (nalog) {
				await this.addPaymentNalog(chatId, user.username, amount, result.id);
			}
			if (addDependants) {
				for (const dep of user.dependants.filter(u => u.active)) {
					const childResult = await this.client.create({
						userId: dep.id,
						amount: 0,
						monthsCount: Number(monthsCount),
						expiresOn: expiresOn.toISOString(),
						planId: plan?.id,
						parentPaymentId: result.id,
					});
					if (childResult) {
						const successMessage = `Платёж на ${monthsCount} месяцев был успешно обработан для пользователя ${dep.username} (${dep.id}) дочернего от ${user.username} (${user.id}). 
Новая дата истечения срока ${formatDate(expiresOn)}`;
						logger.success(`${basename(__filename)}: ${successMessage}`);
						await bot.sendMessage(chatId, successMessage);
						await bot.sendMessage(
							chatId,
							`ID платежа: \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\``,
							{
								parse_mode: 'MarkdownV2',
							},
						);
						if (!dep.active) {
							this.usersClient
								.update(dep.id, {
									active: true,
								})
								.catch(err => {
									bot.sendMessage(
										env.ADMIN_USER_ID,
										`Ошибка при активации юзера ${user.username} ${err}`,
									);
								});
						}
						if (env.BOT_ENV !== 'local') {
							if (dep.pasarguardId) {
								try {
									await this.pasarguardService.updateUser(`${dep.username}_${dep.id}`, {
										expire: addDays(new Date(childResult.expiresOn), 1).toISOString(),
									});
								} catch (err) {
									const ms = `Request to pasarguard failed ${err}`;
									logger.error(ms);
									await bot.sendMessage(chatId, ms);
								}
							}

							if (dep.rwUUID) {
								try {
									await this.rwService.updateUser({
										uuid: dep.rwUUID,
										expireAt: addDays(new Date(childResult.expiresOn), 1).toISOString(),
									});
								} catch (err) {
									const ms = `Request to remnawave failed ${err}`;
									logger.error(ms);
									await bot.sendMessage(chatId, ms);
								}
							}
						}
					} else {
						const errMessage = `По непредвиденным обстоятельствам платеж для дочернего пользователя ${dep.username} не был создан`;
						logger.error(`[${basename(__filename)}]: ${errMessage}`);
						await bot.sendMessage(chatId, errMessage);
					}
				}
			}
			if (env.BOT_ENV !== 'local') {
				if (user.pasarguardId) {
					try {
						await this.pasarguardService.updateUser(`${user.username}_${user.id}`, {
							expire: addDays(new Date(result.expiresOn), 1).toISOString(),
						});
					} catch (err) {
						const ms = `Request to pasarguard failed ${err}`;
						logger.error(ms);
						await bot.sendMessage(chatId, ms);
					}
				}
				if (user.rwUUID) {
					try {
						await this.rwService.updateUser({
							uuid: user.rwUUID,
							expireAt: addDays(new Date(result.expiresOn), 1).toISOString(),
						});
					} catch (err) {
						const ms = `Request to remnawave failed ${err}`;
						logger.error(ms);
						await bot.sendMessage(chatId, ms);
					}
				}
			}
		} catch (err) {
			const errMessage = `Ошибка при обработке платежа для пользователя ${user.username} ${err}`;
			logger.error(`[${basename(__filename)}]: ${errMessage}`);
			await bot.sendMessage(chatId, errMessage);
		} finally {
			this.params.clear();
			globalHandler.finishCommand();
		}
	}

	private async executeReferralPayment(chatId: number, referrer: VPNUser) {
		const amount: number = 0;
		const monthsCount: number = 1;
		const expiresOn = this.params.get('expires') as Date;
		console.log('expiresOn :>> ', expiresOn);
		const addDependants = this.params.get('dependants') as boolean | undefined;
		const referredId = this.params.get('referred') as string;
		await bot.sendMessage(chatId, `Вычисленная дата окончания работы: ${formatDate(expiresOn)}`);

		try {
			const result = await this.client.create({
				userId: referrer.id,
				amount: Number(amount),
				monthsCount: Number(monthsCount),
				expiresOn: expiresOn.toISOString(),
			});

			if (!result) {
				const errMessage = `По непредвиденным обстоятельствам реферальный платеж для пользователя ${referrer.username} c ID ${referrer.id} не был создан`;
				logger.error(`[${basename(__filename)}]: ${errMessage}`);
				await bot.sendMessage(chatId, errMessage);
				return;
			}
			const successMessage = `Реферальный платёж на ${monthsCount} месяц был успешно обработан для пользователя ${referrer.username}. 
Новая дата истечения срока ${formatDate(expiresOn)}.`;
			logger.success(`[${basename(__filename)}]: ${successMessage}`);
			await bot.sendMessage(chatId, successMessage);
			await bot.sendMessage(chatId, `ID платежа: \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\``, {
				parse_mode: 'MarkdownV2',
			});
			const rt = await this.rtClient.create({
				referrerId: referrer.id,
				referredId: Number(referredId),
				paymentId: result.id,
			});

			if (!rt) {
				const errMessage = `По непредвиденным обстоятельствам реферальная транзакция для платежа ${result.id} для пользователя ${referrer.username} c ID ${referrer.id} не была создана`;
				logger.error(`[${basename(__filename)}]: ${errMessage}`);
				await bot.sendMessage(chatId, errMessage);
				return;
			}
			const successRTMessage = `Реферальная транзакция создана для пользователя ${referrer.username} за реферального пользователя ${referredId}`;
			logger.success(`[${basename(__filename)}]: ${successRTMessage}`);
			await bot.sendMessage(chatId, successRTMessage);
			await bot.sendMessage(chatId, `ID транзакции: \`${rt.id.replace(/[-.*#_]/g, match => `\\${match}`)}\``, {
				parse_mode: 'MarkdownV2',
			});
			if (referrer.telegramId) {
				try {
					await bot.sendMessage(referrer.telegramId, dict.referral_payment_processed['ru']);
				} catch (err) {
					logger.error(`${err}`);
				}
			}
			if (addDependants) {
				for (const dep of referrer.dependants.filter(u => u.active)) {
					const childResult = await this.client.create({
						userId: dep.id,
						amount: 0,
						monthsCount: Number(monthsCount),
						expiresOn: expiresOn.toISOString(),
						parentPaymentId: result.id,
					});
					if (childResult) {
						const successMessage = `Реферальный платёж на ${monthsCount} месяцев был успешно обработан для пользователя ${dep.username} (${dep.id}) дочернего от ${referrer.username} (${referrer.id}). 
Новая дата истечения срока ${formatDate(expiresOn)}`;
						logger.success(`${basename(__filename)}: ${successMessage}`);
						await bot.sendMessage(chatId, successMessage);
						await bot.sendMessage(
							chatId,
							`ID платежа: \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\``,
							{
								parse_mode: 'MarkdownV2',
							},
						);
						if (!dep.active) {
							this.usersClient
								.update(dep.id, {
									active: true,
								})
								.catch(err => {
									bot.sendMessage(
										env.ADMIN_USER_ID,
										`Ошибка при активации юзера ${referrer.username} ${err}`,
									);
								});
						}
						if (env.BOT_ENV !== 'local') {
							if (dep.pasarguardId) {
								try {
									await this.pasarguardService.updateUser(`${dep.username}_${dep.id}`, {
										expire: addDays(new Date(childResult.expiresOn), 1).toISOString(),
									});
								} catch (err) {
									const ms = `Request to pasarguard failed ${err}`;
									logger.error(ms);
									await bot.sendMessage(chatId, ms);
								}
							}

							if (dep.rwUUID) {
								try {
									await this.rwService.updateUser({
										uuid: dep.rwUUID,
										expireAt: addDays(new Date(childResult.expiresOn), 1).toISOString(),
									});
								} catch (err) {
									const ms = `Request to remnawave failed ${err}`;
									logger.error(ms);
									await bot.sendMessage(chatId, ms);
								}
							}
						}
					} else {
						const errMessage = `По непредвиденным обстоятельствам реферальный платеж для дочернего пользователя ${dep.username} не был создан`;
						logger.error(`[${basename(__filename)}]: ${errMessage}`);
						await bot.sendMessage(chatId, errMessage);
					}
				}
			}

			if (env.BOT_ENV !== 'local') {
				if (referrer.pasarguardId) {
					try {
						await this.pasarguardService.updateUser(`${referrer.username}_${referrer.id}`, {
							expire: addDays(new Date(result.expiresOn), 1).toISOString(),
						});
					} catch (err) {
						const ms = `Request to pasarguard failed ${err}`;
						logger.error(ms);
						await bot.sendMessage(chatId, ms);
					}
				}
				if (referrer.rwUUID) {
					try {
						await this.rwService.updateUser({
							uuid: referrer.rwUUID,
							expireAt: addDays(new Date(result.expiresOn), 1).toISOString(),
						});
					} catch (err) {
						const ms = `Request to remnawave failed ${err}`;
						logger.error(ms);
						await bot.sendMessage(chatId, ms);
					}
				}
			}
		} catch (err) {
			const errMessage = `Ошибка при обработке реферального платежа для пользователя ${referrer.username} ${err}`;
			logger.error(`[${basename(__filename)}]: ${errMessage}`);
			await bot.sendMessage(chatId, errMessage);
		} finally {
			this.params.clear();
			globalHandler.finishCommand();
		}
	}

	private async showPaymentInfo(message: Message, p: Payment) {
		const cd = JSON.stringify({
			[CmdCode.Scope]: CommandScope.Payments,
			[CmdCode.Context]: {
				[CmdCode.Command]: PaymentCommand.DeleteExec,
				id: p.id.replaceAll('-', ''),
			},
		});

		// const button = [
		// 	{
		// 		text: 'Delete',
		// 		callback_data: cd,
		// 	},
		// ];
		// const markup: InlineKeyboardMarkup = {
		// 	inline_keyboard: [button],
		// };
		if (!p.parentPaymentId) {
			await bot.sendMessage(message.chat.id, this.formatPayment(p), {
				parse_mode: 'MarkdownV2',
				// reply_markup: markup,
			});
			return;
		}
		await bot.sendMessage(
			message.chat.id,
			`Child payment \`${p.id.replace(/[-.*#_]/g, match => `\\${match}`)}\`
Expires On: ${p.expiresOn ? formatDate(p.expiresOn).replace(/[-.*#_]/g, match => `\\${match}`) : 'unset'}`,
			{
				parse_mode: 'MarkdownV2',
				// reply_markup: markup,
			},
		);
		const parentPayment = await this.client.getById(p.parentPaymentId);
		if (parentPayment) {
			await bot.sendMessage(
				message.chat.id,
				`Parent payment \`${parentPayment.id.replace(/[-.*#_]/g, match => `\\${match}`)}\`
Payment Date: ${formatDate(parentPayment.paymentDate).replace(/[-.*#_]/g, match => `\\${match}`)}
Months Count: ${parentPayment.monthsCount}
Expires On: ${parentPayment.expiresOn ? formatDate(parentPayment.expiresOn).replace(/[-.*#_]/g, match => `\\${match}`) : 'unset'}
Amount: ${parentPayment.amount} ${parentPayment.currency}`,
				{
					parse_mode: 'MarkdownV2',
					// reply_markup: markup,
				},
			);
		}
	}

	private async deletePayment(message: Message, id: string) {
		try {
			const result = await this.client.delete(id);
			await bot.sendMessage(
				message.chat.id,
				`Выбранный платёж \`${result.id.replace(/[-.*#_]/g, match => `\\${match}`)}\` датой ${formatDate(result.paymentDate).replace(/[-.*#_]/g, match => `\\${match}`)} успешно удалён из системы`,
				{
					parse_mode: 'MarkdownV2',
				},
			);
		} catch (err) {
			await bot.sendMessage(message.chat.id, `Ошибка удаления платежа: ${err}`);
			logger.error(`Ошибка удаления платежа: ${err}`);
		} finally {
			globalHandler.finishCommand();
		}
	}

	private setPaymentStep(current: keyof typeof this.paymentSteps) {
		setActiveStep(current, this.paymentSteps);
	}

	private getActiveStep(steps: { [key: string]: boolean }) {
		const result = Object.keys(steps).filter(k => steps[k]);
		if (result.length) {
			return result[0];
		}
		return null;
	}

	private log(message: string) {
		logger.log(`[${basename(__filename)}]: ${message}`);
	}
}

export const paymentsService = new PaymentsService();
