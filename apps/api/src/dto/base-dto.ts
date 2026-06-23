import { IsNumber } from 'class-validator';

export class BaseListDto {
  @IsNumber()
  take: number;
  @IsNumber()
  skip: number;
}
