import { Controller, Get, Query } from '@nestjs/common';
import { BotDeliveredMessagesService } from './bot-delivered-messages.service';
import { DeliveredMessagesQueryDto } from './dto/delivered-messages-query.dto';

@Controller('bot-delivered-messages')
export class BotDeliveredMessagesController {
  constructor(
    private readonly botDeliveredMessagesService: BotDeliveredMessagesService,
  ) {}

  @Get()
  async findAll(@Query() dto?: DeliveredMessagesQueryDto) {
    return await this.botDeliveredMessagesService.findAll(dto);
  }
}
