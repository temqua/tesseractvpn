import { ApiProperty } from '@nestjs/swagger';
import { VPNProtocol } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUsersServerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  serverId: number;
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @ApiProperty({ enum: VPNProtocol, example: VPNProtocol.WireGuard })
  @IsEnum(VPNProtocol)
  @IsNotEmpty()
  protocol: VPNProtocol;
  @ApiProperty({ example: 'username' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
