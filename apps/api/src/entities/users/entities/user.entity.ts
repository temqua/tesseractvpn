import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Device, UserRole } from '@prisma/client';

export class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiPropertyOptional({ nullable: true })
  password?: string | null;

  @ApiPropertyOptional({ example: '123456789', nullable: true })
  telegramId?: string | null;

  @ApiPropertyOptional({ example: 'https://t.me/john_doe', nullable: true })
  telegramLink?: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({ example: 'John', nullable: true })
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe', nullable: true })
  lastName?: string | null;

  @ApiPropertyOptional({ example: 'ru', nullable: true })
  languageCode?: string | null;

  @ApiProperty({ example: 150 })
  price: number;

  @ApiProperty({ example: false })
  free: boolean;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiPropertyOptional({ example: 'T-Bank', nullable: true })
  bank?: string | null;

  @ApiProperty({ example: 'RUB' })
  currency: string;

  @ApiPropertyOptional({
    example: 'https://sub.example.com/u1',
    nullable: true,
  })
  subLink?: string | null;

  @ApiPropertyOptional({ example: 'pg_user', nullable: true })
  pasarguardUsername?: string | null;

  @ApiPropertyOptional({ example: 10, nullable: true })
  pasarguardId?: number | null;

  @ApiPropertyOptional({ example: 'https://rw.example.com/u1', nullable: true })
  rwLink?: string | null;

  @ApiPropertyOptional({ example: 'rw_user', nullable: true })
  rwUsername?: string | null;

  @ApiPropertyOptional({ example: 20, nullable: true })
  rwId?: number | null;

  @ApiPropertyOptional({ example: 'uuid-v4', nullable: true })
  rwUUID?: string | null;

  @ApiPropertyOptional({ example: 1, nullable: true })
  payerId?: number | null;

  @ApiPropertyOptional({ example: 2, nullable: true })
  referrerId?: number | null;

  @ApiPropertyOptional({ example: false, nullable: true })
  muted?: boolean | null;

  @ApiProperty({ enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @ApiProperty({ enum: Device, isArray: true, default: [] })
  devices: Device[];
}
