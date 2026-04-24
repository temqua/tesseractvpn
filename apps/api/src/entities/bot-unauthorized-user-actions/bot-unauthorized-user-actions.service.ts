import { Injectable } from '@nestjs/common';
import { CreateBotUnauthorizedUserActionDto } from './dto/create-bot-unauthorized-user-action.dto';
import { UpdateBotUnauthorizedUserActionDto } from './dto/update-bot-unauthorized-user-action.dto';
import { BotUnauthorizedUserActionsRepository } from './bot-unauthorized-user-actions.repository';

@Injectable()
export class BotUnauthorizedUserActionsService {
  constructor(private repository: BotUnauthorizedUserActionsRepository) {}

  async create(dto: CreateBotUnauthorizedUserActionDto) {
    return await this.repository.create(dto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.getById(id);
  }

  async update(id: number, dto: UpdateBotUnauthorizedUserActionDto) {
    return await this.repository.update(id, dto);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
