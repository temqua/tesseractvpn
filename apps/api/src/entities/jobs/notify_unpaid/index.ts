import { Injectable, Logger } from '@nestjs/common';
import { differenceInDays } from 'date-fns';
import { TelegramJobsService } from 'src/entities/telegram/telegram.jobs.service';
import { dict } from '../../../dict';
import { TelegramBotService } from '../../../entities/telegram/telegram.bot.service';
import { DeliveredMessagesService } from '../../../entities/users/delivered-messages/delivered-messages.service';
import { UsersService } from '../../../entities/users/users.service';
import { Job } from '../jobs.definitions';
@Injectable()
export class NotifyUnpaidJob implements Job {
  private readonly logger = new Logger(NotifyUnpaidJob.name);

  constructor(
    private telegramBotService: TelegramBotService,
    private telegramJobsService: TelegramJobsService,
    private deliveredMessagesService: DeliveredMessagesService,
    private usersService: UsersService,
  ) {}
  TRIAL_PERIOD = 3;

  async execute(): Promise<void> {
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
    const trial = fetchedTrial.data;
    for (const user of oldtimers) {
      if (user.telegramId && !user.muted && user.payments.length) {
        try {
          const lang = user.languageCode ?? 'ru';
          const lastPaymentExpiresOn = user.payments[0].expiresOn;
          if (lastPaymentExpiresOn == null) {
            this.telegramJobsService.send(
              `Для пользователя ${user.id} ${user.username} нет даты последнего платежа ${user.payments[0].id}`,
            );
            continue;
          }
          const diff = differenceInDays(lastPaymentExpiresOn, new Date());
          const msg: string =
            diff <= 0
              ? dict.expired[lang](false)
              : dict.expiresAfter[lang](diff, false);
          const sent = await this.telegramBotService.send(msg, {
            chat_id: user.telegramId,
          });
          if (sent) {
            const delivery = await this.deliveredMessagesService.create(
              user.id,
              {
                message: msg,
              },
            );
            this.telegramJobsService.send(
              `Сообщение ${delivery.id} "${msg}" доставлено пользователю ${user.telegramId} ${user.username}`,
            );
          } else {
            this.telegramJobsService.send(
              `Сообщение "${msg}" не доставлено пользователю ${user.telegramId} ${user.username}`,
            );
          }
        } catch (err) {
          this.logger.error(err);
        }
      }
    }
    for (const user of trial) {
      if (user.telegramId && !user.muted) {
        try {
          const lang = user.languageCode ?? 'ru';
          const diff = differenceInDays(new Date(), user.createdAt);
          const msg: string =
            diff >= this.TRIAL_PERIOD
              ? dict.expired[lang](true)
              : dict.expiresAfter[lang](this.TRIAL_PERIOD - diff, true);
          const sent = await this.telegramBotService.send(msg, {
            chat_id: user.telegramId,
          });
          if (sent) {
            const delivery = await this.deliveredMessagesService.create(
              user.id,
              {
                message: msg,
              },
            );
            this.telegramJobsService.send(
              `Сообщение "${delivery.id}" "${msg}" доставлено пользователю ${user.telegramId} ${user.username}`,
            );
          } else {
            this.telegramJobsService.send(
              `Сообщение "${msg}" не доставлено пользователю ${user.telegramId} ${user.username}`,
            );
          }
        } catch (err) {
          this.logger.error(err);
        }
      }
    }
  }
}
