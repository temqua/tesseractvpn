import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderDirection } from '../../../enums';
import { BaseListDto } from 'src/dto/base-dto';

export enum OrderByUserField {
  Username = 'username',
  FirstName = 'firstName',
}

export class UserQueryDto extends BaseListDto {
  @IsNumber()
  @IsOptional()
  id?: number;
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  telegramId?: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsOptional()
  @IsEnum(OrderByUserField)
  orderBy?: OrderByUserField;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  @IsBoolean()
  active?: boolean;
  @IsBoolean()
  unpaid?: boolean;
  @IsString()
  @IsOptional()
  @IsEnum(OrderDirection)
  paymentsOrder?: OrderDirection;
}
