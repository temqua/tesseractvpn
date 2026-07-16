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
import { BotIncomingMessagesService } from './bot-incoming-messages.service';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';
import { IncomingMessagesQueryDto } from './dto/incoming-messages-query.dto';

@Controller('bot-incoming-messages')
export class BotIncomingMessagesController {
  constructor(
    private readonly botIncomingMessagesService: BotIncomingMessagesService,
  ) {}

  @Post()
  async create(
    @Body() createBotIncomingMessageDto: CreateBotIncomingMessageDto,
  ) {
    return await this.botIncomingMessagesService.create(
      createBotIncomingMessageDto,
    );
  }

  @Get()
  async findAll(@Query() dto?: IncomingMessagesQueryDto) {
    return await this.botIncomingMessagesService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.botIncomingMessagesService.findOne(Number(id));
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string) {
    return await this.botIncomingMessagesService.remove(Number(id));
  }
}
