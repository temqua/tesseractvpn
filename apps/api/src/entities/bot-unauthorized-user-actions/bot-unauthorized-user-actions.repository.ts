import { Injectable } from '@nestjs/common';
import { CreateBotUnauthorizedUserActionDto } from './dto/create-bot-unauthorized-user-action.dto';
import { UpdateBotUnauthorizedUserActionDto } from './dto/update-bot-unauthorized-user-action.dto';
import { DatabaseService } from '../../database.service';

@Injectable()
export class BotUnauthorizedUserActionsRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateBotUnauthorizedUserActionDto) {
    return await this.databaseService.client.botUnauthorizedUserActions.create({
      data: {
        ...dto,
      },
    });
  }

  async update(id: number, dto: UpdateBotUnauthorizedUserActionDto) {
    return await this.databaseService.client.botUnauthorizedUserActions.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.client.botUnauthorizedUserActions.delete({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return await this.databaseService.client.botUnauthorizedUserActions.findMany();
  }

  async getById(id: number) {
    return await this.databaseService.client.botUnauthorizedUserActions.findUnique(
      {
        where: {
          id,
        },
      },
    );
  }
}
