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
import { ReferralTransactionsService } from './referral-transactions.service';
import { CreateReferralTransactionDto } from './dto/create-referral-transaction.dto';
import { UpdateReferralTransactionDto } from './dto/update-referral-transaction.dto';
import { ReferralTransactionQueryDto } from './dto/rt-query.dto';

@Controller('referral-transactions')
export class ReferralTransactionsController {
  constructor(
    private readonly referralTransactionsService: ReferralTransactionsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateReferralTransactionDto) {
    return this.referralTransactionsService.create(dto);
  }

  @Get()
  async findAll(@Query() query?: ReferralTransactionQueryDto) {
    return this.referralTransactionsService.findAll(query);
  }

  @Get(':id')
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReferralTransactionDto,
  ) {
    return await this.referralTransactionsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.referralTransactionsService.remove(id);
  }
}
