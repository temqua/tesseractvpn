import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsRepository } from './payments.repository';

import { addDays, addMonths } from 'date-fns';
import env from '../../env';
import { exportToSheet, formatDate } from '../../utils';
import { PlansService } from '../plans/plans.service';
import { UsersService } from '../users/users.service';
import { PaymentInitDto } from './dto/init-payment.dto';
import { PaymentListDto } from './dto/list-dto';
import { IYooKassaWebHook, WebhookEventEnum } from './yookassa.definitions';
import { NalogService } from '../nalog/nalog.service';
import { RemnawaveService } from '../remnawave/remnawave.service';
import { TelegramBotService } from '../telegram/telegram.bot.service';
import { TelegramJobsService } from '../telegram/telegram.jobs.service';
import { dict } from '../../dict';
import { PaymentStatus } from '@prisma/client';
import { IChildResult, IPaymentProcessResultDto } from './payments.types';
import { IPaymentProcessDto } from './dto/process-payment.dto';
@Injectable()
export class PaymentsService {
  constructor(
    private repository: PaymentsRepository,
    private usersService: UsersService,
    private plansService: PlansService,
    private nalogService: NalogService,
    private remnawaveService: RemnawaveService,
    private telegramJobsService: TelegramJobsService,
    private telegramBotService: TelegramBotService,
  ) {}

  private readonly logger = new Logger(PaymentsService.name);

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.repository.create(createPaymentDto);
  }

  async findAll(dto?: PaymentListDto) {
    // if (dto?.userId) {
    //   return await this.repository.getAllByUserId(Number(dto.userId));
    // }
    // if (dto?.from && dto?.to) {
    //   return await this.repository.getByDateRange(
    //     parse(dto.from, 'yyyy-MM-dd', new Date()),
    //     parse(dto.to, 'yyyy-MM-dd', new Date()),
    //   );
    // }
    if (dto?.sheet === 'true') {
      return await this.repository.getAllForSheet();
    }
    return await this.repository.findAll(dto);
  }

  async findOne(id: string) {
    const payment = await this.repository.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return await this.repository.update(id, updatePaymentDto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }

  async sum() {
    return await this.repository.sum();
  }

  async export() {
    const paymentsData = await this.repository.getAllForSheet();
    const preparedPaymentsData = paymentsData.map((row) => {
      return [
        row.id ?? '',
        row.user.username ?? '',
        row.user.firstName ?? '',
        row.user.lastName ?? '',
        row.amount ?? 0,
        row.paymentDate
          ? new Date(row.paymentDate).toLocaleString('ru-RU', {
              timeZone: 'UTC',
            })
          : '',
        row.expiresOn
          ? new Date(row.expiresOn).toLocaleString('ru-RU', { timeZone: 'UTC' })
          : '',
        row.monthsCount ?? 0,
        row.plan?.name ?? '',
        row.parentPaymentId ?? '',
      ];
    });
    return await exportToSheet(
      env.SHEET_ID,
      'Payments!A2',
      preparedPaymentsData,
    );
  }

  async handleHook(dto: IYooKassaWebHook) {
    if (dto.event === WebhookEventEnum.PaymentSucceeded) {
      // return this.jobsService.execute(TesseractJob.ApprovePayment, {
      //   addNalog: env.APP_ENV === 'production',
      // });
    }
    return JSON.stringify(dto);
  }

  async init(dto: PaymentInitDto) {
    const [user, plan] = await Promise.all([
      this.usersService.findOne(Number(dto.userId)),
      this.plansService.findOne(Number(dto.planId)),
    ]);
    let startPoint = new Date();
    if (user?.payments?.length) {
      const lastPayment = user.payments[0];
      if (lastPayment.expiresOn) {
        const expiresOnLastPayment = new Date(lastPayment.expiresOn);
        if (expiresOnLastPayment > new Date()) {
          startPoint = expiresOnLastPayment;
        }
      }
    }
    const calculated = addMonths(startPoint, plan.months);
    return await this.repository.create({
      amount: plan.amount,
      monthsCount: plan.months,
      planId: plan.id,
      userId: dto.userId,
      expiresOn: calculated.toISOString(),
    });
  }

  async approve(id: string | null) {
    if (!id) {
      return;
    }
    const payment = await this.repository.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    const result = await this.repository.approve(id);
    if (result) {
      const successMessage = `Платёж ${payment.id} количеством ${payment.amount} рублей на ${payment.monthsCount} месяцев был успешно подтверждён для пользователя ${payment.user.username}.
Новая дата истечения срока ${payment.expiresOn ? formatDate(payment.expiresOn) : 'null'}.`;
      this.logger.log(successMessage);
      await this.telegramJobsService.sendMessage(successMessage);
      this.telegramJobsService.sendMessage(
        `ID платежа: \`${payment.id.replace(/[-.*#_]/g, (match) => `\\${match}`)}\``,
        {
          parse_mode: 'MarkdownV2',
        },
      );
    }
    return result;
  }

  async process(
    id: string,
    params: IPaymentProcessDto,
  ): Promise<IPaymentProcessResultDto> {
    const payment = await this.repository.findOne(id);

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new InternalServerErrorException('Payment is not succeeded');
    }
    const dependants: IChildResult[] = [];
    let nalog = false;
    let notified = false;
    let renewed = false;
    let active = payment.user.active;
    const isLocal = env.APP_ENV === 'local';
    if (!payment.user.active) {
      try {
        const result = await this.usersService.update(payment.user.id, {
          active: true,
        });
        active = result.active;
        if (!result) {
          this.telegramJobsService.sendMessage(
            `Ошибка при активации юзера ${payment.user.username}. Не вернулся результат из this.usersService.update`,
          );
        } else if (!result.active) {
          this.telegramJobsService.sendMessage(
            `Ошибка при активации юзера ${payment.user.username}. Вернулся result.active false`,
          );
        }
      } catch (err) {
        this.telegramJobsService.sendMessage(
          `Ошибка при активации юзера ${payment.user.username} ${err}`,
        );
      }
    }

    if (payment.user.telegramId) {
      try {
        const lang = payment.user.languageCode || 'ru';
        notified = await this.telegramBotService.sendMessage(
          dict.payment_processed[lang](payment.amount),
          {
            chat_id: Number(payment.user.telegramId),
          },
        );
      } catch (err) {
        this.logger.error(`${err}`);
      }
    }
    if (payment.user.rwUUID && !isLocal) {
      try {
        const result = await this.remnawaveService.updateUser({
          uuid: payment.user.rwUUID,
          expireAt: addDays(
            new Date(payment.expiresOn as Date),
            1,
          ).toISOString(),
        });
        renewed = Boolean(result);
      } catch (err) {
        const ms = `Request to remnawave failed ${err}`;
        this.logger.error(ms);
        this.telegramJobsService.sendMessage(ms);
      }
    }
    if (params.nalog && !isLocal) {
      nalog = await this.addPaymentNalog(
        payment.id,
        payment?.user.username,
        payment?.amount,
      );
    }
    if (params.dependants) {
      for (const dep of payment.user.dependants.filter((u) => u.active)) {
        const current: IChildResult = {
          userId: dep.id,
          username: dep.username,
          active: dep.active,
          renewed: false,
          created: false,
        };
        const childResult = await this.create({
          userId: dep.id,
          amount: 0,
          monthsCount: payment.monthsCount,
          expiresOn: payment.expiresOn?.toISOString() ?? null,
          planId: payment.plan?.id ?? null,
          parentPaymentId: payment.id,
          status: PaymentStatus.SUCCEEDED,
        });
        current.created = Boolean(childResult.id);

        if (!childResult.id) {
          const errMessage = `По непредвиденным обстоятельствам платеж для дочернего пользователя ${dep.username} не был создан`;
          this.logger.error(errMessage);
          this.telegramJobsService.sendMessage(errMessage);
          dependants.push(current);
          continue;
        }
        const successMessage = `Платёж на ${payment.monthsCount} месяцев был успешно обработан для пользователя ${dep.username} (${dep.id}) дочернего от ${payment.user.username} (${payment.user.id}). 
Новая дата истечения срока ${formatDate(payment.expiresOn as Date)}`;
        this.logger.log(successMessage);
        await this.telegramJobsService.sendMessage(successMessage);
        this.telegramJobsService.sendMessage(
          `ID платежа: \`${childResult.id.replace(/[-.*#_]/g, (match) => `\\${match}`)}\``,
          {
            parse_mode: 'MarkdownV2',
          },
        );
        if (!dep.active) {
          try {
            const childUpdateResult = await this.usersService.update(dep.id, {
              active: true,
            });
            current.active = Boolean(childUpdateResult.active);
          } catch (err) {
            this.telegramJobsService.sendMessage(
              `Ошибка при активации юзера ${childResult.user.username} ${err}`,
            );
          }
        }

        if (dep.rwUUID && !isLocal) {
          try {
            const newDate = addDays(childResult.expiresOn as Date, 1);
            const result = await this.remnawaveService.updateUser({
              uuid: dep.rwUUID,
              expireAt: newDate.toISOString(),
            });
            current.renewed = result.response.expireAt == newDate.toISOString();
          } catch (err) {
            current.renewed = false;
            const ms = `Request to remnawave failed ${err}`;
            this.logger.error(ms);
            this.telegramJobsService.sendMessage(ms);
          }
        }
        dependants.push(current);
      }
    }
    return {
      nalog,
      active,
      dependants,
      notified,
      renewed,
    };
  }

  async addPaymentNalog(id: string, username: string, amount: number) {
    let success = false;
    try {
      const token = await this.nalogService.auth();
      const paymentId = await this.nalogService.addNalog(token, amount, id);
      if (!paymentId) {
        const errMessage = `Ошибка! При добавлении налога за пользователя ${username} не получен ID операции`;
        this.logger.error(errMessage);
        this.telegramJobsService.sendMessage(errMessage);
      } else {
        const successMessage = `Налог успешно добавлен за пользователя ${username}`;
        this.logger.log(successMessage);
        this.telegramJobsService.sendMessage(successMessage);
        success = true;
      }
    } catch (err) {
      const errMessage = `Ошибка при добавлении налога для пользователя ${username}: ${err}`;
      this.logger.error(errMessage);
      this.telegramJobsService.sendMessage(errMessage);
    }
    return success;
  }
}
