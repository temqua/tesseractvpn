import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';
import { DeliveredMessagesQueryDto } from './dto/delivered-messages-query-dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BotUnauthorizedDeliveredMessagesRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateBotUnauthorizedDeliveredMessageDto) {
    return await this.databaseService.client.botUnauthorizedMessageDelivery.create(
      {
        data: {
          ...dto,
        },
      },
    );
  }

  async update(id: number, dto: UpdateBotUnauthorizedDeliveredMessageDto) {
    return await this.databaseService.client.botUnauthorizedMessageDelivery.update(
      {
        where: {
          id,
        },
        data: {
          ...dto,
        },
      },
    );
  }

  async remove(id: number) {
    return await this.databaseService.client.botUnauthorizedMessageDelivery.delete(
      {
        where: {
          id,
        },
      },
    );
  }

  async findAll(dto: DeliveredMessagesQueryDto) {
    const where: Prisma.BotUnauthorizedMessageDeliveryWhereInput = {};
    if (dto?.id) {
      where.id = Number(dto.id);
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
      this.databaseService.client.botUnauthorizedMessageDelivery.findMany(
        params,
      ),
      this.databaseService.client.botUnauthorizedMessageDelivery.count(
        countParams,
      ),
    ]);
    return {
      data,
      count,
    };
  }

  async getById(id: number) {
    return await this.databaseService.client.botUnauthorizedMessageDelivery.findUnique(
      {
        where: {
          id,
        },
      },
    );
  }
}
