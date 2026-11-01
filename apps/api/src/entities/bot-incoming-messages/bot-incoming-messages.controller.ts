import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';
import { IncomingMessagesQueryDto } from './dto/incoming-messages-query.dto';
import { BotIncomingMessage } from './entities/bot-incoming-message.entity';

@ApiTags('bot-incoming-messages')
@ApiBearerAuth()
@Controller('bot-incoming-messages')
export class BotIncomingMessagesController {
  constructor(
    private readonly botIncomingMessagesService: BotIncomingMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать запись входящего сообщения' })
  @ApiOkResponse({ type: BotIncomingMessage })
  async create(
    @Body() createBotIncomingMessageDto: CreateBotIncomingMessageDto,
  ) {
    return await this.botIncomingMessagesService.create(
      createBotIncomingMessageDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Список входящих сообщений' })
  @ApiOkResponse({ type: BotIncomingMessage, isArray: true })
  async findAll(@Query() dto?: IncomingMessagesQueryDto) {
    return await this.botIncomingMessagesService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Входящее сообщение по id' })
  @ApiOkResponse({ type: BotIncomingMessage })
  async findOne(@Param('id') id: string) {
    return await this.botIncomingMessagesService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить входящее сообщение' })
  @ApiOkResponse({ type: BotIncomingMessage })
  async update(
    @Param('id') id: string,
    @Body() updateBotIncomingMessageDto: UpdateBotIncomingMessageDto,
  ) {
    return await this.botIncomingMessagesService.update(
      Number(id),
      updateBotIncomingMessageDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить входящее сообщение' })
  async remove(@Param('id') id: string) {
    return await this.botIncomingMessagesService.remove(Number(id));
  }
}
