import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerDto {
  @ApiProperty({ example: 'https://vpn.example.com' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'Основной сервер' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
