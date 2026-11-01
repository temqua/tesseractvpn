import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BotDeliveredMessagesService } from './bot-delivered-messages.service';
import { DeliveredMessagesQueryDto } from './dto/delivered-messages-query.dto';

@ApiTags('bot-delivered-messages')
@ApiBearerAuth()
@Controller('bot-delivered-messages')
export class BotDeliveredMessagesController {
  constructor(
    private readonly botDeliveredMessagesService: BotDeliveredMessagesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список доставленных сообщений' })
  async findAll(@Query() dto?: DeliveredMessagesQueryDto) {
    return await this.botDeliveredMessagesService.findAll(dto);
  }
}
