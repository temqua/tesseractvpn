import { Injectable } from '@nestjs/common';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';
import { BotUnauthorizedDeliveredMessagesRepository } from './bot-unauthorized-delivered-messages.repository';

@Injectable()
export class BotUnauthorizedDeliveredMessagesService {
  constructor(private repository: BotUnauthorizedDeliveredMessagesRepository) {}

  async create(dto: CreateBotUnauthorizedDeliveredMessageDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.getById(id);
  }

  async update(id: number, dto: UpdateBotUnauthorizedDeliveredMessageDto) {
    return await this.repository.update(id, dto);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
