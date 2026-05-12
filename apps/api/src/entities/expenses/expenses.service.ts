import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseCategory } from '@prisma/client';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesRepository } from './expenses.repository';
import { exportToSheet } from '../../utils';
import env from '../../env';

@Injectable()
export class ExpensesService {
  constructor(private repository: ExpensesRepository) {}

  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const result = await this.repository.create(
        createExpenseDto.category,
        createExpenseDto.amount,
        createExpenseDto.description,
      );
      return result;
    } catch (err) {
      if (err?.meta?.driverAdapterError?.cause) {
        throw new InternalServerErrorException(
          err?.meta?.driverAdapterError?.cause?.originalMessage,
        );
      }
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(id: string) {
    const expense = await this.repository.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async list(category?: ExpenseCategory) {
    return await this.repository.list(category);
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      return await this.repository.update(id, updateExpenseDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async remove(id: string) {
    return this.repository.delete(id);
  }

  async sum(category?: ExpenseCategory) {
    if (category === ExpenseCategory.Nalog) {
      return await this.repository.sumNalogs();
    }
    if (category === ExpenseCategory.Servers) {
      return await this.repository.sumServers();
    }
    return await this.repository.sum();
  }

  async export() {
    const expensesData = await this.repository.list();
    const preparedExpensesData = expensesData.map((row) => {
      return [
        row.id ?? '',
        row.paymentDate
          ? new Date(row.paymentDate).toLocaleString('ru-RU', {
              timeZone: 'UTC',
            })
          : '',
        row.amount.toNumber() ?? 0,
        row.category ?? '',
        row.description ?? '',
      ];
    });
    return await exportToSheet(
      env.SHEET_ID,
      'Expenses!A2',
      preparedExpensesData,
    );
  }
}
