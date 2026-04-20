import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BotIncomingMessagesService } from './bot-incoming-messages.service';
import { CreateBotIncomingMessageDto } from './dto/create-bot-incoming-message.dto';
import { UpdateBotIncomingMessageDto } from './dto/update-bot-incoming-message.dto';

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
  async findAll() {
    return await this.botIncomingMessagesService.findAll();
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
