import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';
import { CreateBotUnauthorizedUserActionDto } from './dto/create-bot-unauthorized-user-action.dto';
import { UpdateBotUnauthorizedUserActionDto } from './dto/update-bot-unauthorized-user-action.dto';

@Controller('bot-unauthorized-user-actions')
export class BotUnauthorizedUserActionsController {
  constructor(
    private readonly botUnauthorizedUserActionsService: BotUnauthorizedUserActionsService,
  ) {}

  @Post()
  async create(
    @Body()
    createBotUnauthorizedUserActionDto: CreateBotUnauthorizedUserActionDto,
  ) {
    return this.botUnauthorizedUserActionsService.create(
      createBotUnauthorizedUserActionDto,
    );
  }

  @Get()
  async findAll() {
    return this.botUnauthorizedUserActionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.botUnauthorizedUserActionsService.findOne(Number(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateBotUnauthorizedUserActionDto: UpdateBotUnauthorizedUserActionDto,
  ) {
    return this.botUnauthorizedUserActionsService.update(
      Number(id),
      updateBotUnauthorizedUserActionDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.botUnauthorizedUserActionsService.remove(Number(id));
  }
}
