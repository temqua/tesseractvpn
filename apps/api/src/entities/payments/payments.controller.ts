import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
import { IsPublic } from '../../decorators/is-public';
import { PaymentApproveDto } from './dto/approve-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentInitDto } from './dto/init-payment.dto';
import { PaymentListDto } from './dto/list-dto';
import { IPaymentProcessDto } from './dto/process-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import {
  WebhookEventEnum,
  type IYooKassaWebHook,
} from './yookassa.definitions';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('admin/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  private logger = new Logger('PaymentsController');

  @Post()
  @ApiOperation({ summary: 'Создать платёж' })
  @ApiOkResponse({ type: Payment })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список платежей' })
  @ApiOkResponse({ type: Payment, isArray: true })
  async findAll(@Query() dto?: PaymentListDto) {
    return await this.paymentsService.findAll(dto);
  }

  @Get('/sum')
  @ApiOperation({ summary: 'Сумма платежей' })
  async sum() {
    return await this.paymentsService.sum();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Платёж по id' })
  @ApiOkResponse({ type: Payment })
  async findOne(@Param('id') id: string) {
    return await this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить платёж' })
  @ApiOkResponse({ type: Payment })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить платёж' })
  async remove(@Param('id') id: string) {
    return await this.paymentsService.remove(id);
  }

  @Post('/export')
  @ApiOperation({ summary: 'Экспорт платежей' })
  async export() {
    return await this.paymentsService.export();
  }

  @IsPublic()
  @ApiOperation({ summary: 'Webhook ЮKassa' })
  @Post('/webhook')
  async hook(@Body() dto: IYooKassaWebHook) {
    return await this.paymentsService.handleHook(dto);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Тестовый webhook ЮKassa' })
  @Post('/webhook-test')
  async hookTest(@Body() dto: IYooKassaWebHook) {
    this.logger.log(dto);
    return await this.paymentsService.handleHook(dto, true);
  }

  @Post('/init')
  @ApiOperation({ summary: 'Инициализировать платёж' })
  async init(@Body() dto: PaymentInitDto) {
    return await this.paymentsService.init(dto);
  }

  @Post('/approve/:id')
  @ApiOperation({ summary: 'Подтвердить платёж' })
  async approve(@Param('id') id: string, @Body() dto: PaymentApproveDto) {
    return await this.paymentsService.approve(id, dto.notify);
  }

  @Post('/process/:id')
  @ApiOperation({ summary: 'Обработать платёж' })
  async process(@Param('id') id: string, @Body() body: IPaymentProcessDto) {
    return await this.paymentsService.process(id, body);
  }

  @Post('/checkout/:id')
  @ApiOperation({ summary: 'Сформировать checkout-ссылку' })
  async checkout(@Param('id') id: string) {
    return await this.paymentsService.checkout(id);
  }
}
