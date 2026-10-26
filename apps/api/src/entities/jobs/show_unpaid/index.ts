import { Injectable, Logger } from '@nestjs/common';
import { Job } from '../jobs.definitions';
import { UsersService } from '../../../entities/users/users.service';
import { TelegramJobsService } from '../../../entities/telegram/telegram.jobs.service';
import { TelegramBotService } from '../../../entities/telegram/telegram.bot.service';
import { formatDate } from '../../../utils';
import { InlineKeyboardButton } from '../../../entities/telegram/telegram.definitions';
import { CmdCode, CommandScope, VPNUserCommand } from '../../../enums';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ShowUnpaidJob implements Job {
  private readonly logger = new Logger(ShowUnpaidJob.name);

  constructor(
    private telegramBotService: TelegramBotService,
    private telegramJobsService: TelegramJobsService,
    private usersService: UsersService,
  ) {}
  TRIAL_PERIOD = 3;

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async execute() {
    const oldtimersPromise = this.usersService.findAll({
      expiresAfterDays: this.TRIAL_PERIOD,
      trial: 'false',
      free: 'false',
      active: 'true',
    });
    const trialPromise = this.usersService.findAll({
      trial: 'true',
      free: 'false',
      active: 'true',
    });
    const [fetchedUsers, fetchedTrial] = await Promise.all([
      oldtimersPromise,
      trialPromise,
    ]);
    const oldtimers = fetchedUsers.data;
    const trialUsers = fetchedTrial.data;
    for (const user of oldtimers) {
      if (user.payments.length) {
        try {
          const lastPayment = user.payments[0];
          if (!lastPayment) {
            await this.telegramJobsService.sendMessage(
              `Для пользователя ${user.id} ${user.username} нет даты последнего платежа ${user.payments[0].id}`,
            );
            continue;
          }
          await this.telegramBotService.sendMessage(
            `User ${user.username.replace(/[-.*#_]/g, (match) => `\\${match}`)} \\(ID ${user.id}\\) last payment UUID \`${lastPayment.id}\`
	Payment Date: ${formatDate(lastPayment.paymentDate).replace(/[-.*#_]/g, (match) => `\\${match}`)}
	Months count: ${lastPayment.monthsCount}
	Expires on: ${lastPayment.expiresOn ? formatDate(lastPayment.expiresOn).replace(/[-.*#_]/g, (match) => `\\${match}`) : 'Unset'}
	Amount: ${lastPayment.amount}`,
            {
              parse_mode: 'MarkdownV2',
            },
          );
        } catch (err) {
          this.logger.error(err);
        }
      }
    }
    for (const trial of trialUsers) {
      await this.telegramBotService.sendMessage(
        `User ${trial.username} ${trial.telegramLink ?? ''} created at ${formatDate(trial.createdAt)} has to pay soon`,
      );
    }
    await this.telegramBotService.sendMessage(
      `Users 
${oldtimers.map((u) => `${u.username} ${u.telegramLink ?? ''}`).join('\n')} 
have no payments for next month.`,
    );
    const oldtimersButtons: InlineKeyboardButton[][] = oldtimers.map((user) => {
      return [
        {
          text: user.username,
          callback_data: JSON.stringify({
            [CmdCode.Scope]: CommandScope.Users,
            [CmdCode.Context]: {
              [CmdCode.Command]: VPNUserCommand.GetById,
              id: user.id,
            },
          }),
        },
      ];
    });
    await this.telegramBotService.sendMessage('Select oldtimer user', {
      reply_markup: {
        inline_keyboard: oldtimersButtons,
      },
    });
    await this.telegramBotService.sendMessage(
      `Users 
${trialUsers.map((u) => `${u.username} ${u.telegramLink ?? ''}`).join('\n')} 
have to pay soon.`,
    );
    const trialUsersButtons: InlineKeyboardButton[][] = trialUsers.map(
      (user) => {
        return [
          {
            text: user.username,
            callback_data: JSON.stringify({
              [CmdCode.Scope]: CommandScope.Users,
              [CmdCode.Context]: {
                [CmdCode.Command]: VPNUserCommand.GetById,
                id: user.id,
              },
            }),
          },
        ];
      },
    );
    await this.telegramBotService.sendMessage('Select trial user', {
      reply_markup: {
        inline_keyboard: trialUsersButtons,
      },
    });
    if (!oldtimers.length) {
      await this.telegramJobsService.sendMessage('All users paid the bills 👍');
    }
  }
}
