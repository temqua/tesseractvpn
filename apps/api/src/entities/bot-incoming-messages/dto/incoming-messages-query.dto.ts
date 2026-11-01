import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByIncomingMessageField {
  ID = 'id',
  TelegramId = 'telegramId',
  Username = 'username',
  FirstName = 'firstName',
  LastName = 'lastName',
  CreatedAt = 'createdAt',
}

export class IncomingMessagesQueryDto extends BaseListDto {
  @ApiPropertyOptional({ type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id?: number;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telegramId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;
  @ApiPropertyOptional({ enum: OrderByIncomingMessageField })
  @IsOptional()
  @IsEnum(OrderByIncomingMessageField)
  orderBy?: OrderByIncomingMessageField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
