import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseListDto } from './dto/list-dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';

@ApiTags('expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать расход' })
  @ApiOkResponse({ type: Expense })
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return await this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список расходов' })
  @ApiOkResponse({ type: Expense, isArray: true })
  async findAll(@Query() dto?: ExpenseListDto) {
    return await this.expensesService.list(dto);
  }

  @Get('/sum')
  @ApiOperation({ summary: 'Сумма расходов' })
  async sum(@Query('category') category?: ExpenseCategory) {
    return await this.expensesService.sum(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Расход по id' })
  @ApiOkResponse({ type: Expense })
  async findOne(@Param('id') id: string) {
    return await this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить расход' })
  @ApiOkResponse({ type: Expense })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return await this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить расход' })
  async remove(@Param('id') id: string) {
    return await this.expensesService.remove(id);
  }

  @Post('/export')
  @ApiOperation({ summary: 'Экспорт расходов' })
  async export() {
    return await this.expensesService.export();
  }
}
