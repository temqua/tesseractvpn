import { Controller, Get, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentListDto, UserPaymentsListDto } from './dto/list-dto';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class UserPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Список платежей текущего пользователя' })
  @ApiOkResponse({ type: Payment, isArray: true })
  async findAll(@Req() req, @Query() dto?: UserPaymentsListDto) {
    const uid: string = req.user?.id?.toString();
    const dto1: PaymentListDto = {
      ...dto,
      userId: uid,
    };
    return await this.paymentsService.findAll(dto1);
  }
}
