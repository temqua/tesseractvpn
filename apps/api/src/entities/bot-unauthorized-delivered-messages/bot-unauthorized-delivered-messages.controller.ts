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
import { BotUnauthorizedDeliveredMessagesService } from './bot-unauthorized-delivered-messages.service';
import { CreateBotUnauthorizedDeliveredMessageDto } from './dto/create-bot-unauthorized-delivered-message.dto';
import { UnauthorizedUsersDeliveredMessagesQueryDto } from './dto/delivered-messages-query-dto';
import { UpdateBotUnauthorizedDeliveredMessageDto } from './dto/update-bot-unauthorized-delivered-message.dto';

@Controller('bot-unauthorized-delivered-messages')
export class BotUnauthorizedDeliveredMessagesController {
  constructor(
    private readonly botUnauthorizedDeliveredMessagesService: BotUnauthorizedDeliveredMessagesService,
  ) {}

  @Post()
  async create(@Body() dto: CreateBotUnauthorizedDeliveredMessageDto) {
    return await this.botUnauthorizedDeliveredMessagesService.create(dto);
  }

  @Get()
  async findAll(@Query() dto: UnauthorizedUsersDeliveredMessagesQueryDto) {
    return await this.botUnauthorizedDeliveredMessagesService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.botUnauthorizedDeliveredMessagesService.findOne(+id);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string) {
    return await this.botUnauthorizedDeliveredMessagesService.remove(+id);
  }
}
