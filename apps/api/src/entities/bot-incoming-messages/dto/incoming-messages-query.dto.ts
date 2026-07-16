import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderDirection } from '../../../enums';
import { BaseListDto } from '../../../dto/base-dto';

export enum OrderByUserField {
  Username = 'username',
  FirstName = 'firstName',
}

export class IncomingMessagesQueryDto extends BaseListDto {
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
  @IsString()
  @IsOptional()
  lastName?: string;
  // @IsOptional()
  // @IsEnum(OrderByUserField)
  // orderBy?: OrderByUserField;
  // @IsString()
  // @IsOptional()
  // @IsEnum(OrderDirection)
  // orderDirection?: OrderDirection;
}
