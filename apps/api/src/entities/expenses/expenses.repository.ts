import { Expense, ExpenseCategory } from '@prisma/client';
import { DatabaseService } from '../../database.service';
import { Injectable } from '@nestjs/common';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseListDto } from './dto/list-dto';

type ExpenseSearchParams = {
  skip?: number;
  take?: number;
  where?: {
    category?: ExpenseCategory;
  };
};

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
    const where = dto?.filterBy
      ? {
          [dto.filterBy]: dto?.filterOperation
            ? {
                [dto.filterOperation]: dto.filterValue,
              }
            : dto.filterValue,
        }
      : undefined;
    const params: ExpenseSearchParams = {
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
