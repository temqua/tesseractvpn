import { Injectable } from '@nestjs/common';
import { DeliveredMessagesQueryDto } from './dto/delivered-messages-query.dto';
import { BotDeliveredMessagesRepository } from './bot-delivered-messages.repository';

@Injectable()
export class BotDeliveredMessagesService {
  constructor(private repository: BotDeliveredMessagesRepository) {}

  async findAll(dto?: DeliveredMessagesQueryDto) {
    return await this.repository.findAll(dto);
  }
}
