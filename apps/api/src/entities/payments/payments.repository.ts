import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, Prisma } from '@prisma/client';
import { endOfDay, parse, startOfDay } from 'date-fns';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentListDto } from './dto/list-dto';

@Injectable()
export class PaymentsRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.databaseService.client.payment.create({
      data: {
        userId: createPaymentDto.userId,
        amount: createPaymentDto.amount,
        monthsCount: createPaymentDto.monthsCount,
        expiresOn: createPaymentDto.expiresOn,
        planId: createPaymentDto.planId ?? null,
        parentPaymentId: createPaymentDto.parentPaymentId ?? null,
        currency: 'RUB',
      },
    });
  }

  async findAll(dto?: PaymentListDto) {
    const where: Prisma.PaymentWhereInput = {};
    if (dto?.id) {
      where.id = {
        contains: dto?.id,
      };
    }
    if (dto?.from && dto?.to) {
      where.paymentDate = {
        gte: startOfDay(parse(dto.from, 'yyyy-MM-dd', new Date())),
        lte: endOfDay(parse(dto.to, 'yyyy-MM-dd', new Date())),
      };
    }
    if (dto?.userId) {
      where.userId = Number(dto?.userId);
    }

    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
    };
    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.payment.findMany(params),
      this.databaseService.client.payment.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async findOne(id: string) {
    return await this.databaseService.client.payment.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return await this.databaseService.client.payment.update({
      data: {
        ...updatePaymentDto,
      },
      where: {
        id,
      },
    });
  }

  async getAllForSheet() {
    return await this.databaseService.client.payment.findMany({
      orderBy: {
        paymentDate: 'desc',
      },
      include: {
        user: {},
        plan: {},
      },
    });
  }

  // async getByDate(date: Date): Promise<Payment[]> {
  //   return await this.databaseService.client.payment.findMany({
  //     where: {
  //       paymentDate: {
  //         gte: startOfDay(date),
  //         lte: endOfDay(date),
  //       },
  //     },
  //   });
  // }

  async getByDateRange(from: Date, to: Date): Promise<Payment[]> {
    return await this.databaseService.client.payment.findMany({
      where: {
        paymentDate: {
          gte: startOfDay(from),
          lte: endOfDay(to),
        },
      },
    });
  }

  async sum() {
    const result = await this.databaseService.client.payment.aggregate({
      _sum: {
        amount: true,
      },
    });
    return result?._sum;
  }

  async remove(id: string) {
    return await this.databaseService.client.payment.delete({
      where: {
        id,
      },
    });
  }

  async getAllByUserId(userId: number): Promise<Payment[]> {
    return await this.databaseService.client.payment.findMany({
      where: {
        userId,
      },
    });
  }
}
