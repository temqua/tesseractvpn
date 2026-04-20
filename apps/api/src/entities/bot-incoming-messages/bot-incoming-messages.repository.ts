import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';

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

  async findAll() {
    return await this.databaseService.client.botIncomingMessages.findMany();
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
