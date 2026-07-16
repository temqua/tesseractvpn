import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';
import { IncomingMessagesQueryDto } from './dto/incoming-messages-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BotIncomingMessagesRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateBotIncomingMessageDto) {
    return await this.databaseService.client.botIncomingMessages.create({
      data: {
        ...dto,
      },
    });
  }

  async findAll(dto?: IncomingMessagesQueryDto) {
    const where: Prisma.BotIncomingMessagesWhereInput = {};
    if (dto?.id) {
      where.id = Number(dto.id);
    }
    if (dto?.username) {
      where.username = {
        mode: 'insensitive',
        contains: dto.username,
      };
    }
    if (dto?.telegramId) {
      where.telegramId = dto.telegramId;
    }
    if (dto?.firstName) {
      where.firstName = {
        mode: 'insensitive',
        contains: dto.firstName,
      };
    }
    if (dto?.lastName) {
      where.lastName = {
        mode: 'insensitive',
        contains: dto.lastName,
      };
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
      this.databaseService.client.botIncomingMessages.findMany(params),
      this.databaseService.client.botIncomingMessages.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async getById(id: number) {
    return await this.databaseService.client.botIncomingMessages.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, dto: UpdateBotIncomingMessageDto) {
    return await this.databaseService.client.botIncomingMessages.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.client.botIncomingMessages.delete({
      where: {
        id,
      },
    });
  }
}
