import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserExistsPipe } from '../user-exists-pipe';
import { DeliveredMessagesService } from './delivered-messages.service';
import { CreateDeliveredMessageDto } from './dto/create-delivered-message.dto';
import { UpdateDeliveredMessageDto } from './dto/update-delivered-message.dto';
import { MessageDelivery } from './entities/message-delivery.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users/:userId/delivered-messages')
export class DeliveredMessagesController {
  constructor(
    private readonly deliveredMessagesService: DeliveredMessagesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать доставленное сообщение пользователя' })
  @ApiOkResponse({ type: MessageDelivery })
  async create(
    @Param('userId', UserExistsPipe) userId: string,

    @Body() createDeliveredMessageDto: CreateDeliveredMessageDto,
  ) {
    return await this.deliveredMessagesService.create(
      Number(userId),
      createDeliveredMessageDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Доставленные сообщения пользователя' })
  @ApiOkResponse({ type: MessageDelivery, isArray: true })
  async findAll(@Param('userId', UserExistsPipe) userId: string) {
    return await this.deliveredMessagesService.findAll(Number(userId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Доставленное сообщение по id' })
  @ApiOkResponse({ type: MessageDelivery })
  async findOne(
    @Param('userId', UserExistsPipe) userId: string,
    @Param('id') id: string,
  ) {
    return await this.deliveredMessagesService.findOne(
      Number(userId),
      Number(id),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить доставленное сообщение' })
  @ApiOkResponse({ type: MessageDelivery })
  async update(
    @Param('userId', UserExistsPipe) userId: string,
    @Param('id') id: string,
    @Body() updateDeliveredMessageDto: UpdateDeliveredMessageDto,
  ) {
    return this.deliveredMessagesService.update(
      Number(userId),
      Number(id),
      updateDeliveredMessageDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить доставленное сообщение' })
  async remove(
    @Param('userId', UserExistsPipe) userId: string,
    @Param('id') id: string,
  ) {
    return this.deliveredMessagesService.remove(Number(userId), Number(id));
  }
}
