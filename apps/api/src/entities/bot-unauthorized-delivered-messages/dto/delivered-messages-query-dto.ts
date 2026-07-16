import { IsNumber, IsOptional } from 'class-validator';
import { BaseListDto } from 'src/dto/base-dto';

export class DeliveredMessagesQueryDto extends BaseListDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}
