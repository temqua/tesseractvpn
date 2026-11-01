import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'https://sub.example.com/u1',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  subLink?: string | null;

  @ApiPropertyOptional({ example: 'pg_user', nullable: true })
  @IsString()
  @IsOptional()
  pasarguardUsername?: string | null;

  @ApiPropertyOptional({ example: 10, nullable: true })
  @IsNumber()
  @IsOptional()
  pasarguardId?: number | null;

  @ApiPropertyOptional({ example: 'https://rw.example.com/u1', nullable: true })
  @IsString()
  @IsOptional()
  rwLink?: string | null;

  @ApiPropertyOptional({ example: 'rw_user', nullable: true })
  @IsString()
  @IsOptional()
  rwUsername?: string | null;

  @ApiPropertyOptional({ example: 20, nullable: true })
  @IsNumber()
  @IsOptional()
  rwId?: number | null;

  @ApiPropertyOptional({ example: 'uuid-v4', nullable: true })
  @IsString()
  @IsOptional()
  rwUUID?: string | null;

  @ApiPropertyOptional({ example: 'T-Bank', nullable: true })
  @IsString()
  @IsOptional()
  bank?: string | null;

  @ApiPropertyOptional({ example: 'RUB', default: 'RUB' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  free?: boolean;

  @ApiPropertyOptional({ example: false, nullable: true })
  @IsBoolean()
  @IsOptional()
  muted?: boolean | null;
}
