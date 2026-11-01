import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class BaseListDto {
  @ApiPropertyOptional({
    description: 'Максимальное количество возвращаемых записей',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  take?: number;

  @ApiPropertyOptional({
    description: 'Количество записей, которые нужно пропустить',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;
}
