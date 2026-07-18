import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { DeliveredMessagesQueryDto } from './dto/delivered-messages-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BotDeliveredMessagesRepository {
  constructor(private databaseService: DatabaseService) {}

  async findAll(dto?: DeliveredMessagesQueryDto) {
    const where: Prisma.MessageDeliveryWhereInput = {};
    if (dto?.id) {
      where.id = Number(dto.id);
    }
    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
      include: {
        user: true,
      },
    };
    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.messageDelivery.findMany(params),
      this.databaseService.client.messageDelivery.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }
}
