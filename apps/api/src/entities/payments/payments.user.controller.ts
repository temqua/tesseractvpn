import { Controller, Get, Query, Req } from '@nestjs/common';
import { PaymentListDto, UserPaymentsListDto } from './dto/list-dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class UserPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(@Req() req, @Query() dto?: UserPaymentsListDto) {
    const uid: string = req.user?.id?.toString();
    const dto1: PaymentListDto = {
      ...dto,
      userId: uid,
    };
    return await this.paymentsService.findAll(dto1);
  }
}
