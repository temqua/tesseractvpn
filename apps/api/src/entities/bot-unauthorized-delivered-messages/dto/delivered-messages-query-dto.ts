import { IsNumber, IsOptional } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';

export class UnauthorizedUsersDeliveredMessagesQueryDto extends BaseListDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}
