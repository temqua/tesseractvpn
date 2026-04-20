import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';
import { BotIncomingMessagesRepository } from './bot-incoming-messages.repository';

@Injectable()
export class BotIncomingMessagesService {
  constructor(private repository: BotIncomingMessagesRepository) {}

  async create(dto: CreateBotIncomingMessageDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    const record = await this.repository.getById(id);

    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, dto: UpdateBotIncomingMessageDto) {
    return await this.repository.update(id, dto);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
