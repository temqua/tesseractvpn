import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Базовый' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  minCount: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  maxCount: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  monthsCount: number;
}
