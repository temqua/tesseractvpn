import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReferralTransactionsService } from './referral-transactions.service';
import { CreateReferralTransactionDto } from './dto/create-referral-transaction.dto';
import { UpdateReferralTransactionDto } from './dto/update-referral-transaction.dto';
import { ReferralTransactionQueryDto } from './dto/rt-query.dto';
import { ReferralTransaction } from './entities/referral-transaction.entity';

@ApiTags('referral-transactions')
@ApiBearerAuth()
@Controller('referral-transactions')
export class ReferralTransactionsController {
  constructor(
    private readonly referralTransactionsService: ReferralTransactionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать реферальную транзакцию' })
  @ApiOkResponse({ type: ReferralTransaction })
  async create(@Body() dto: CreateReferralTransactionDto) {
    return this.referralTransactionsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список реферальных транзакций' })
  @ApiOkResponse({ type: ReferralTransaction, isArray: true })
  async findAll(@Query() query?: ReferralTransactionQueryDto) {
    return this.referralTransactionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Реферальная транзакция по id' })
  @ApiOkResponse({ type: ReferralTransaction })
  async findOne(@Param('id') id: string) {
    const rt = await this.referralTransactionsService.findOne(id);
    if (!rt) {
      throw new NotFoundException(
        `Referral Transaction with id ${id} not found`,
      );
    }
    return rt;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить реферальную транзакцию' })
  @ApiOkResponse({ type: ReferralTransaction })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReferralTransactionDto,
  ) {
    return await this.referralTransactionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить реферальную транзакцию' })
  async remove(@Param('id') id: string) {
    return await this.referralTransactionsService.remove(id);
  }
}
