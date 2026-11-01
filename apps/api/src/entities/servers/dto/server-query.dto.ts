import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseListDto } from '../../../dto/base-dto';
import { OrderDirection } from '../../../enums';

export enum OrderByServerField {
  ID = 'id',
  Name = 'name',
}

export enum OrderByServerUserField {
  Protocol = 'protocol',
  Username = 'username',
  ID = 'id',
  AssignedAt = 'assignedAt',
}

export class ServerQueryDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({ enum: OrderByServerField })
  @IsOptional()
  @IsEnum(OrderByServerField)
  orderBy?: OrderByServerField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}

export class ServerUserQueryDto extends BaseListDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  id?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  protocol?: string;
  @ApiPropertyOptional({ enum: OrderByServerUserField })
  @IsOptional()
  @IsEnum(OrderByServerUserField)
  orderBy?: OrderByServerUserField;
  @ApiPropertyOptional({ enum: OrderDirection })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
