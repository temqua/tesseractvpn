import { Injectable } from '@nestjs/common';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';
import { BotUnauthorizedDeliveredMessagesRepository } from './bot-unauthorized-delivered-messages.repository';
import { UnauthorizedUsersDeliveredMessagesQueryDto } from './dto/delivered-messages-query-dto';

@Injectable()
export class BotUnauthorizedDeliveredMessagesService {
  constructor(private repository: BotUnauthorizedDeliveredMessagesRepository) {}

  async create(dto: CreateBotUnauthorizedDeliveredMessageDto) {
    return await this.repository.create(dto);
  }

  async findAll(dto: UnauthorizedUsersDeliveredMessagesQueryDto) {
    return await this.repository.findAll(dto);
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
