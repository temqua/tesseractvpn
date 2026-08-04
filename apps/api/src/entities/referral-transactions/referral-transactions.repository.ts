import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateReferralTransactionDto } from './dto/create-referral-transaction.dto';
import { UpdateReferralTransactionDto } from './dto/update-referral-transaction.dto';
import { Prisma } from '@prisma/client';
import { ReferralTransactionQueryDto } from './dto/rt-query.dto';

@Injectable()
export class ReferralTransactionsRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateReferralTransactionDto) {
    return await this.databaseService.client.referralTransaction.create({
      data: {
        paymentId: dto.paymentId,
        referredId: dto.referredId,
        referrerId: dto.referrerId,
      },
    });
  }

  async findAll(dto?: ReferralTransactionQueryDto) {
    const where: Prisma.ReferralTransactionWhereInput = {};
    if (dto?.id) {
      where.id = {
        contains: dto?.id,
      };
    }
    if (dto?.referrerId) {
      where.referrerId = Number(dto?.referrerId);
    }

    if (dto?.referredId) {
      where.referredId = Number(dto?.referredId);
    }

    if (dto?.paymentId) {
      where.paymentId = dto?.paymentId;
    }

    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
      include: {
        referrer: true,
        referred: true,
        payment: true,
      },
    };
    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.referralTransaction.findMany(params),
      this.databaseService.client.referralTransaction.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async update(id: string, dto: UpdateReferralTransactionDto) {
    return await this.databaseService.client.referralTransaction.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    console.log('id :>> ', id);
    const rt = await this.databaseService.client.referralTransaction.findUnique(
      {
        where: {
          id,
        },
      },
    );
    console.log('rt :>> ', rt);
    await this.databaseService.client.referralTransaction.delete({
      where: {
        id,
      },
    });
    await this.databaseService.client.payment.delete({
      where: {
        id: rt?.paymentId,
      },
    });
  }

  async findOne(id: string) {
    return await this.databaseService.client.referralTransaction.findUnique({
      where: {
        id,
      },
      include: {
        referrer: true,
        referred: true,
        payment: true,
      },
    });
  }
}
