import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';

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

  async findAll() {
    return await this.databaseService.client.botUnauthorizedMessageDelivery.findMany();
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
