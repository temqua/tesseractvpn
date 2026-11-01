import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UnauthorizedUsersDeliveredMessagesQueryDto } from './dto/unauthorized-delivered-messages-query-dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';
import { BotUnauthorizedDeliveredMessage } from './entities/bot-unauthorized-delivered-message.entity';

@ApiTags('bot-unauthorized-delivered-messages')
@ApiBearerAuth()
@Controller('bot-unauthorized-delivered-messages')
export class BotUnauthorizedDeliveredMessagesController {
  constructor(
    private readonly botUnauthorizedDeliveredMessagesService: BotUnauthorizedDeliveredMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать запись доставленного сообщения' })
  @ApiOkResponse({ type: BotUnauthorizedDeliveredMessage })
  async create(@Body() dto: CreateBotUnauthorizedDeliveredMessageDto) {
    return await this.botUnauthorizedDeliveredMessagesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список доставленных сообщений' })
  @ApiOkResponse({ type: BotUnauthorizedDeliveredMessage, isArray: true })
  async findAll(@Query() dto: UnauthorizedUsersDeliveredMessagesQueryDto) {
    return await this.botUnauthorizedDeliveredMessagesService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Доставленное сообщение по id' })
  @ApiOkResponse({ type: BotUnauthorizedDeliveredMessage })
  async findOne(@Param('id') id: string) {
    return await this.botUnauthorizedDeliveredMessagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить доставленное сообщение' })
  @ApiOkResponse({ type: BotUnauthorizedDeliveredMessage })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBotUnauthorizedDeliveredMessageDto,
  ) {
    return await this.botUnauthorizedDeliveredMessagesService.update(
      Number(id),
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить доставленное сообщение' })
  async remove(@Param('id') id: string) {
    return await this.botUnauthorizedDeliveredMessagesService.remove(+id);
  }
}
