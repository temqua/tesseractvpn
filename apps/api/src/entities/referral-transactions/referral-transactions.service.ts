import { Injectable } from '@nestjs/common';
import { CreateReferralTransactionDto } from './dto/create-referral-transaction.dto';
import { UpdateReferralTransactionDto } from './dto/update-referral-transaction.dto';
import { ReferralTransactionsRepository } from './referral-transactions.repository';
import { ReferralTransactionQueryDto } from './dto/rt-query.dto';

@Injectable()
export class ReferralTransactionsService {
  constructor(private repository: ReferralTransactionsRepository) {}

  async create(createReferralTransactionDto: CreateReferralTransactionDto) {
    return await this.repository.create(createReferralTransactionDto);
  }

  async findAll(dto?: ReferralTransactionQueryDto) {
    return await this.repository.findAll(dto);
  }

  async findOne(id: string) {
    return await this.repository.findOne(id);
  }

  async update(id: string, dto: UpdateReferralTransactionDto) {
    return await this.repository.update(id, dto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
