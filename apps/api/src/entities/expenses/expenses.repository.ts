import { Injectable } from '@nestjs/common';
import { ExpenseCategory, Prisma } from '@prisma/client';
import { endOfDay, parse, startOfDay } from 'date-fns';
import { DatabaseService } from '../../database.service';
import { ExpenseListDto } from './dto/list-dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(
    category: ExpenseCategory,
    amount: number,
    description: string = '',
  ) {
    return await this.databaseService.client.expense.create({
      data: {
        category,
        amount,
        description,
      },
    });
  }

  async findOne(id: string) {
    return await this.databaseService.client.expense.findUnique({
      where: {
        id,
      },
    });
  }

  async list(dto?: ExpenseListDto) {
    const where: Prisma.ExpenseWhereInput = {};
    if (dto?.id) {
      where.id = {
        contains: dto.id,
      };
    }

    if (dto?.from && dto?.to) {
      where.paymentDate = {
        gte: startOfDay(parse(dto.from, 'yyyy-MM-dd', new Date())),
        lte: endOfDay(parse(dto.to, 'yyyy-MM-dd', new Date())),
      };
    }
    if (dto?.category) {
      where.category = dto?.category;
    }
    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
    };

    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.expense.findMany(params),
      this.databaseService.client.expense.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async sum() {
    const result = await this.databaseService.client.expense.aggregate({
      _sum: {
        amount: true,
      },
    });
    return result?._sum;
  }

  async sumNalogs() {
    const result = await this.databaseService.client.expense.aggregate({
      where: {
        category: ExpenseCategory.Nalog,
      },
      _sum: {
        amount: true,
      },
    });
    return result?._sum;
  }
  async sumServers() {
    const result = await this.databaseService.client.expense.aggregate({
      where: {
        category: ExpenseCategory.Servers,
      },
      _sum: {
        amount: true,
      },
    });
    return result?._sum;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return await this.databaseService.client.expense.update({
      data: {
        ...updateExpenseDto,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    return await this.databaseService.client.expense.delete({
      where: {
        id,
      },
    });
  }
}
