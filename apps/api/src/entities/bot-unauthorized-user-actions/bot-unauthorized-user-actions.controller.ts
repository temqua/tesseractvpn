import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BotUnauthorizedUserActionsService } from './bot-unauthorized-user-actions.service';
import { CreateBotUnauthorizedUserActionDto } from './dto/create-bot-unauthorized-user-action.dto';
import { UpdateBotUnauthorizedUserActionDto } from './dto/update-bot-unauthorized-user-action.dto';
import { BotUnauthorizedUserAction } from './entities/bot-unauthorized-user-action.entity';

@ApiTags('bot-unauthorized-user-actions')
@ApiBearerAuth()
@Controller('bot-unauthorized-user-actions')
export class BotUnauthorizedUserActionsController {
  constructor(
    private readonly botUnauthorizedUserActionsService: BotUnauthorizedUserActionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Создать запись действия неавторизованного пользователя',
  })
  @ApiOkResponse({ type: BotUnauthorizedUserAction })
  async create(
    @Body()
    createBotUnauthorizedUserActionDto: CreateBotUnauthorizedUserActionDto,
  ) {
    return this.botUnauthorizedUserActionsService.create(
      createBotUnauthorizedUserActionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Список действий неавторизованных пользователей' })
  @ApiOkResponse({ type: BotUnauthorizedUserAction, isArray: true })
  async findAll() {
    return this.botUnauthorizedUserActionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Действие по id' })
  @ApiOkResponse({ type: BotUnauthorizedUserAction })
  async findOne(@Param('id') id: string) {
    return this.botUnauthorizedUserActionsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить действие' })
  @ApiOkResponse({ type: BotUnauthorizedUserAction })
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
  @ApiOperation({ summary: 'Удалить действие' })
  async remove(@Param('id') id: string) {
    return this.botUnauthorizedUserActionsService.remove(Number(id));
  }
}
